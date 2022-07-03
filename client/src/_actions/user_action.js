import axios from "axios";
import { LOGIN_USER } from "./types";

export function loginUser(dataFromSubmit) {
  // server/index.js에 작성한 라우트와 통신
  const request = axios
    .post("/api/user/login", dataFromSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    paylaod: request,
  };
}
