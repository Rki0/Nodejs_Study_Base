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

// 회원가입을 위한 Route 생성
app.post("/register", (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  // body는 이런 식으로 구성되겠지?
  // {
  //   id: "hello",
  //   password: "123"
  // }

  const user = new User(req.body);

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

// port번 포트에서 이 앱을 실행
// 이 앱이 port를 listen하면 작성해놓은 콘솔이 실행됨
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
