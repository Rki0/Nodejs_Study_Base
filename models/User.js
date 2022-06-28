const mogoose = require("mongoose");

// 스키마 작성
const userSchema = mogoose.Schema({
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

// 모델 생성(스키마를 감싸는 녀석)
// User라는 이름으로 사용할 것이고, userSchema가 거기에 들어가 있음을 의미.
const User = mogoose.model("User", userSchema);

// User를 다른 모듈에서도 쓸 수 있도록 export
module.exports = { User };
