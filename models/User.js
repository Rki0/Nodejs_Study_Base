const mongoose = require("mongoose");

// 암호화에 사용할 bcrypt 모듈 가져옴.
const bcrypt = require("bcrypt");

// salt를 이용해서 비밀번호를 암호화해야함.
// 그러기 위해서 salt를 먼저 생성해야겠지?
// salt가 몇 글자인지 나타내는게 saltRounds
const saltRounds = 10;

// token을 얻기 위해 jsonwebToken 모듈 가져옴
const jwt = require("jsonwebtoken");

// 스키마 작성
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    // trim은 hi 00823@hi.com처럼 빈칸이 발생한 것을 없애줌
    trim: true,
    // unique는 유일성을 가지게 해줌. 이메일은 하나만 가능해야하니까 유일하게 해줘야지!
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  // 어떤 유저가 관리자도 될 수있고, 일반 유저가 될 수도 있기 때문에 role을 부여해줌.
  // 여기서는 1이면 관리자, 0이면 일반 유저가 되도록 Number 타입으로 설정해주는 걸로 해보자.
  role: {
    type: Number,
    // 지정하지 않으면 자동으로 0이 됨
    default: 0,
  },
  // 중괄호 없이 이렇게 써도 됨
  image: String,
  // token은 유효성 관리할 때 사용
  token: {
    type: String,
  },
  // token을 사용할 수 있는 기간 설정
  tokenExp: {
    type: Number,
  },
});

// pre()는 mongoose에서 가져온 메서드.
// pre 뜻이 ~전에이므로, 첫번째 인자가 실행되기 전에 무엇인가를 실행한다는 뜻! save() 메서드가 진행되기 전에 무엇인가를 실행한다!
// 정보 암호화
userSchema.pre("save", function (next) {
  // userSchema 내부의 정보들을 의미함
  let user = this;

  // 이메일을 바꾸는 등의 유저 인터랙션이 있다면, save로 인해서 이 부분이 실행되므로, 비밀번호가 재암호화되는 문제가 발생할 수 있다.
  // 따라서, 조건문으로 이미 암호화된 비밀번호를 다시 암호화하지 않도록 만들어주자.
  // user 안에 password 부분이 바뀔 때만 이걸 실행해라~
  if (user.isModified("password")) {
    // 비밀번호를 암호화 시킨다.
    // salt를 만든다(generate salt = gensalt)
    bcrypt.genSalt(saltRounds, function (err, salt) {
      // 만약 오류가 발생하면 next(err)를 리턴
      // next하면 index.js에 있는 user.save()쪽으로 바로 가버림.
      if (err) return next(err);

      // myPlaintextPassword는 아까 생성했던 순수한 password를 의미함.(= user.password)
      // User 모델에 넣었던 것이므로, userSchema의 password를 가져오면 됨. (let user = this;)
      bcrypt.hash(user.password, salt, function (err, hash) {
        // 파라미터 hash는 암호화된 비밀번호를 의미함.

        // 실패하면 돌려보냄
        if (err) return next(err);

        // myPlaintextPassword(= user.password)를 암호화된 hash 값으로 변경해줌
        user.password = hash;

        // 전부 완성이 됐다면 user.save()로 돌아가야지
        next();
      });
    });
  } else {
    // 비밀번호를 바꾸는게 아니라면 바로 user.save()로 넘어가도록 해줌.
    next();
  }
});

// 커스텀 매서드 comparePassword 생성
userSchema.methods.comparePassword = function (plainPassword, callback) {
  // plainPassword는 1234567, DB에 있는 암호화된 비밀번호는 $2b$10$qLjFBdQFfw.4HK9NQySfkeW.XuzYgeXM.B8q.kwwQ/mhCinPlk9tK
  // 암호화된 것은 복구할 수 없으므로, plainPassword를 암호화해서 비교해줘야함

  // this.password는 암호화된 비밀번호
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    // 비밀번호가 다르면 callback(err)를 리턴
    if (err) return callback(err);

    // 같으면 callback에 에러가 없고, isMatch(= true)를 전달
    callback(null, isMatch);
  });
};

// 커스텀 매서드 generateToken 생성
userSchema.methods.generateToken = function (callback) {
  let user = this;

  // jsonwebToken을 이용해서 token 생성하기
  // sign() 매서드는 jsonwebToken에서 제공하는 것.
  // user.id + "secretToken" = token 생성
  // 나중에 token을 해석할 때는 "secretToken"을 입력하면 user.id를 알 수 있게 되는 것임.
  let token = jwt.sign(user._id.toHexString(), "secretToken");

  // userSchema의 token에 변수 token을 넣어줌
  user.token = token;
  user.save(function (err, user) {
    if (err) return callback(err);

    // 에러가 없으면 user 정보만 보냄(index.js에 있는 generateToken 매서드로)
    callback(null, user);
  });
};

// 커스텀 매서드 findByToken 생성
userSchema.statics.findByToken = function (token, callback) {
  let user = this;

  // user._id + "secretToken" = token
  // 이렇게 token을 만들었으므로 복호화 할 때도 secretToken를 사용

  // token을 decode한다. verify() 매서드를 사용.
  jwt.verify(token, "secretToken", function (err, decoded) {
    // decoded 된 것은 user._id를 의미하겠지!
    // 유저 아이디를 이용해서 유저를 찾은 다음
    // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err);

      callback(null, user);
    });
  });
};

// 모델 생성(스키마를 감싸는 녀석)
// User라는 이름으로 사용할 것이고, userSchema가 거기에 들어가 있음을 의미.
const User = mongoose.model("User", userSchema);

// User를 다른 모듈에서도 쓸 수 있도록 export
module.exports = { User };
