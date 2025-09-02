import { createContext,useContext,useState } from "react";
import { apiClient } from "../API/apiClient";
import { UseJwtAuth } from "../API/JWTAuthentication";
import { signUpAPI } from "../API/signUpAPI";
// import { signupAPI } from "../API/UserAPI";


//Create a  context
const AuthContext=createContext();
export default function AuthProvider({children}){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token,setToken]=useState(null);
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
        //The below line uses basic authentication
        // const BasicAuthToken="Basic " + window.btoa(username + ':' +password);
        try{
            //Now we are using Jwt Authentication
            const response=await UseJwtAuth(username,password);
            if (response.status===200) {
                setIsAuthenticated(true);
                setUser(username);
                console.log(response);
                const jwtToken = "Bearer ".concat(response.data.token);
                console.log(" JWT token =    "+jwtToken);
                setToken(jwtToken);
                apiClient.interceptors.request.use((config)=>
                {
                    config.headers.Authorization=jwtToken;
                    return config;
                })
             
                return true;
            }
            else{
                console.log("Failed Authentication");
                console.log(response);
                setIsAuthenticated(false);
                setUser(null);
                setToken(null)
                return false;
            }
       }
       catch(error){
            console.log(error);
            console.log(error.message);
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


    return(
        <AuthContext.Provider value={{user,isAuthenticated,signup,login,logout,token}}>
            {children}
        </AuthContext.Provider>
    );
    
}
export function useAuth() {
    return useContext(AuthContext);
}
