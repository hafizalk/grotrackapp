import axios from "axios";
import jwt_decode from "jwt-decode";

const jwtInterceptor = axios.create({});

jwtInterceptor.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  config.headers["Authorization"] = `bearer ${token}`;
  return config;
});

jwtInterceptor.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      let token = localStorage.getItem("token");
      if (jwt_decode(token).exp < Date.now() / 1000) {
        localStorage.clear();
      }
    } 
    
    return Promise.reject(error);
  }
);
export default jwtInterceptor;
