const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리를 하는 곳
  // 1. client cookie에서 token을 가져온다.
  let token = req.cookies.x_auth;

  // 2. token을 복호화 한 후, 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    // 에러 발생하면 throw
    if (err) throw err;

    // 유저가 없을 때 적어놓은 json을 보냄
    if (!user) return res.json({ isAuth: false, error: true });

    // 유저가 있다면
    // req.token에 token을 넣어주고, req.user에 user를 넣어줌.
    // 이렇게 하면 index.js에서 auth 라우트 부분을 사용할 때, req 파라미터에서 뽑아서 쓸 수 있게됨.
    req.token = token;
    req.user = user;

    // 할 거 다했으니까 미들웨어를 나갈 수 있도록 next() 처리
    next();
  });

  // 3. 유저가 있으면 인증 okay
  // 4. 유저가 없으면 인증 no
};

module.exports = { auth };
