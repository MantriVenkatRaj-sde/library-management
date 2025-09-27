import { useUserContext } from "../context/UserContext";
import { apiClient } from "./apiClient";

export function getReadersList(username){
    return apiClient.get(`/${encodeURIComponent(username)}/readersList`)
}

export function getLikedBooks(username){
    return apiClient.get(`/user/${encodeURIComponent(username)}/liked`)
}
export function getUserDetails(username){
    return apiClient.get(`/users/${encodeURIComponent(username)}`);
}

export function isBookLiked(username,isbn){
    return apiClient.get(`/user/${encodeURIComponent(username)}/${encodeURIComponent(isbn)}/isLiked`);
}

export function isBookSaved(username,isbn){
    return apiClient.get(`/user/${encodeURIComponent(username)}/${encodeURIComponent(isbn)}/isSaved`);
}