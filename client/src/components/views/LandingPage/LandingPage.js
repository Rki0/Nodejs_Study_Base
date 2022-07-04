import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  useEffect(() => {
    // 서버는 setupProxy.js에서 설정해줬으므로 / 이후로 적어주면 됨.
    // CORS 에러 발생!
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);

  const navigate = useNavigate();

  const logoutHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      // 로그아웃이 성공하면 로그인 페이지로 이동
      if (response.data.success) {
        navigate("/login");
      } else {
        alert("로그아웃이 실패했습니다.");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>

      <button onClick={logoutHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
