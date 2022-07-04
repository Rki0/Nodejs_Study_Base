import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";

function RegisterPage() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const [name, setName] = useState("");

  const [pswd, setPswd] = useState("");

  const [pswdCon, setPswdCon] = useState("");

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handlePswd = (e) => {
    setPswd(e.target.value);
  };

  const handlePswdCon = (e) => {
    setPswdCon(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 비밀번호와 비밀번호 확인이 다르면 다음 동작 실행 못함.
    if (pswd !== pswdCon) {
      return alert("비밀번호와 비밀번호 확인은 같아야합니다.");
    }

    let body = {
      email: email,
      name: name,
      password: pswd,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        navigate("/login");
      } else {
        alert("Failed to join");
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
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit}
      >
        <label>Email</label>
        <input type="email" value={email} onChange={handleEmail} />

        <label>Name</label>
        <input type="text" value={name} onChange={handleName} />

        <label>Password</label>
        <input type="password" value={pswd} onChange={handlePswd} />

        <label>Confirm Password</label>
        <input type="password" value={pswdCon} onChange={handlePswdCon} />

        <br />
        <button>회원 가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
