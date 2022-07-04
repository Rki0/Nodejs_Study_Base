import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from "./hoc/auth";

export default function App() {
  const AuthenticLanding = Auth(LandingPage, null);
  const AuthenticLogin = Auth(LoginPage, false);
  const AuthenticRegister = Auth(RegisterPage, false);

  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/" element={<AuthenticLanding />} />
        <Route path="/login" element={<AuthenticLogin />} />
        <Route path="/register" element={<AuthenticRegister />} />
      </Routes>
    </div>
  );
}
