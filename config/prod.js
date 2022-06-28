// 이 파일은 production 용.
// 배포된 애플리케이션에서는 여기서 데이터를 사용하도록 만들 것.
module.exports = {
  // MONGO_URI는 배포하는 곳(예를 들어, HEROKU)에서 관리되는 key의 이름. 내가 임의로 지정할 수 있음. 거기서 지정한거랑 이 파일에 있는거랑 같게 해야함!
  mongoURI: process.env.MONGO_URI,
};
