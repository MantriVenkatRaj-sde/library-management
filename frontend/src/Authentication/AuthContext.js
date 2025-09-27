import { createContext,useContext,useState } from "react";
import { apiClient } from "../API/apiClient";
import { UseJwtAuth } from "../API/JWTAuthentication";
import { signUpAPI } from "../API/signUpAPI";
import { useNavigate } from "react-router-dom";
// import { signupAPI } from "../API/UserAPI";


//Create a  context
const AuthContext=createContext();
export default function AuthProvider({children}){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token,setToken]=useState(null);
    const navigate=useNavigate();
    async function signup(user) {
    try {
        const response = await signUpAPI(user);
        if (response.status === 200) {
        console.log("SignUp successful");
        return true;
        } else {
        console.log("SignUp failed");
        return false;
        }
    } catch (error) {
        console.log("Error in signup:", error);
        return false;
    }
    }


    async function login(username, password) {
    try {
      const response = await UseJwtAuth(username, password);
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(username);
        const jwtToken = "Bearer ".concat(response.data.token);
        setToken(jwtToken);

        // ✅ request interceptor (attach token)
        apiClient.interceptors.request.use((config) => {
          config.headers.Authorization = jwtToken;
          return config;
        });

        // ✅ response interceptor (handle expired token)
        apiClient.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response && error.response.status === 401) {
              console.log("Token expired → logging out...");
              logout();
              navigate("/login"); // redirect user to login
            }
            return Promise.reject(error);
          }
        );

        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return false;
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      return false;
    }
  }

  function logout() {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signup, login, logout, token }}
    >
      {children}
    </AuthContext.Provider>
  );    
}
export function useAuth() {
    return useContext(AuthContext);
}
