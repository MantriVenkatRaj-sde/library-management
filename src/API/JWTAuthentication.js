import { apiClient } from "./apiClient";

export const UseJwtAuth=
    (username,password)=>{
        return apiClient.post(`/authenticate`,{username,password});
    }
