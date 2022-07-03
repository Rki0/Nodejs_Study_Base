// process.env.NODE_ENV는 환경변수
// dev 모드일 때는 NODE_ENV가 development로 나오고, 배포 모드일 때는 production으로 나옴.
// 이 점을 활용해서 분기 처리를 하고, 알맞은 공간에서 데이터를 뽑아 쓰게 처리
if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}
