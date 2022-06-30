// express 모듈을 가져옴
const express = require("express");

// 새로운 express 앱을 만듦
const app = express();

// 포트는 아무거나 가능. 백서버로 둘 포트 번호임.
const port = 8000;

// body-parser 모듈 가져옴
const bodyParser = require("body-parser");

// body-parser에 옵션 주기
// application/x-www-form-urlencoded 처럼 생긴 데이터를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 처럼 생긴 데이터를 분석해서 가져올 수 있게 해줌.
app.use(bodyParser.json());

// cookie-parser 모듈 가져옴
const cookieParser = require("cookie-parser");

// 애플리케이션에서 cookieParser 사용할 수 았도록 해줌
app.use(cookieParser());

// auth 모듈 가져옴.
const { auth } = require("./middleware/auth");

// mongoURI를 사용하기 위해 가져옴
const config = require("./config/key");

// mogoose 모듈을 가져와서 내 어플리케이션이랑 연결
const mongoose = require("mongoose");

mongoose
  .connect(
    // 이 데이터는 아이디, 비밀번호가 들어있으므로 보호해야할 부분!
    // 따라서, 이 부분은 따로 떼어 놓고, gitignore로 그 파일은 안 올라가게끔 해야함.
    // 원래 mongoDB 아이디, 비밀번호 있던 자리
    config.mongoURI
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("Error", err));

// root 디렉토리(/)에 Hello World!를 출력되게 해줌
app.get("/", (req, res) => {
  res.send("Hello World!~~안녕하세요");
});

// User 모델 가져옴
const { User } = require("./models/User");

// 회원가입을 위한 register Route 생성
app.post("/api/users/register", (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  // body는 이런 식으로 구성되겠지?
  // {
  //   id: "hello",
  //   password: "123"
  // }

  const user = new User(req.body);

  // save하기 전에 정보를 암호화를 해야함

  // save()는 mongoDB 메서드임
  // 정보 저장하는 것
  user.save((err, doc) => {
    // 실패했을 때 json 형태로 에러 정보 전달
    if (err) return res.json({ success: false, err });

    // 성공했을 때도 마찬가지
    return res.status(200).json({
      success: true,
    });
  });
});

// login Route 만들기
app.post("/api/users/login", (req, res) => {
  // 1. 요청된 이메일을 데이터베이(스에 있는지 찾는다
  // findOne() 메서드는 mongoDB에서 제공하는 것으로, 말그대로 데이터를 찾을 때 사용. 첫번째 인자로 찾고자하는 이메일을 넣어주면됨.
  User.findOne({ email: req.body.email }, (err, user) => {
    // 만약 일치하는 이메일이 없다면(user가 없다면)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 2. 있다면 비밀번호가 맞는지 확인한다
    // 커스텀 매서드인 comparePassword 사용(만드는 것은 User.js에서 하면 됨)
    // req.body.password를 비교할 것이고, 맞다면 isMatch로 가져오면 됨.
    user.comparePassword(req.body.password, (err, isMatch) => {
      // 일치하지 않는다면(isMatch = false)
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }

      // 3. 다 맞다면 그 유저를 위한 token을 생성
      // 커스텀 매서드 generateToken 사용
      user.generateToken((err, user) => {
        // 에러가 발생한다면 status는 400으로 설정하고 err를 send 함.
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지 등등
        // 여기서는 쿠키에 저장
        // 개발자 도구에서 볼 수 있는 cookie에 x_auth라는 이름으로 토큰이 저장됨.
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// auth 라우트 만들기
// auth라는 미들웨어를 사용.
app.get("/api/users/auth", auth, (req, res) => {
  // 미들웨어를 통과해서 여기까지 왔다면 Authentication이 true라는 것
  // 유저 정보를 제공하자
  res.status(200).json({
    _id: req.user._id,
    // role이 0이면 일반 유저, 0이 아니면 관리자(이 부분은 User.js에서 임의로 설정했던 것들임)
    isAdmin: req.user.role === 0 ? false : true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// 로그아웃 라우트 만들기
// 이번에는 유저를 찾아서 그 유저의 토큰을 지워주는게 목적 -> 로그인이 해제됨
// 로그인된 상태이기 때문에 auth 미들웨어를 사용
app.get("/api/users/logout", auth, (req, res) => {
  // 유저를 찾아서 업데이트 시킴
  // auth에서 req에 데이터를 넣어놨으므로, 그를 활용
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).send({ success: true });
  });
});

// port번 포트에서 이 앱을 실행
// 이 앱이 port를 listen하면 작성해놓은 콘솔이 실행됨
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
