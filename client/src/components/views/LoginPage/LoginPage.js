import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";

function LoginPage() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const [pswd, setPswd] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePswd = (e) => {
    setPswd(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let body = {
      email: email,
      password: pswd,
    };

    dispatch(loginUser(body));
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
        <label>Password</label>
        <input type="password" value={pswd} onChange={handlePswd} />

        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
