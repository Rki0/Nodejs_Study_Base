// express 모듈을 가져옴
const express = require("express");

// 새로운 express 앱을 만듦
const app = express();

// 포트는 아무거나 가능. 백서버로 둘 포트 번호임.
const port = 8000;

// root 디렉토리(/)에 Hello World!를 출력되게 해줌
app.get("/", (req, res) => {
  res.send("Hello World!~~안녕하세요~");
});

// port번 포트에서 이 앱을 실행
// 이 앱이 port를 listen하면 작성해놓은 콘솔이 실행됨
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
