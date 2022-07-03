import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    // 서버는 setupProxy.js에서 설정해줬으므로 / 이후로 적어주면 됨.
    // CORS 에러 발생!
    axios.get("/api/hello").then((response) => console.log(response.data));
  }, []);

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
    </div>
  );
}

export default LandingPage;
