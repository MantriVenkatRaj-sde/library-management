import { apiClient } from "./apiClient";

export function signUpAPI(user){
    return apiClient.post(`/signup`,user)
}