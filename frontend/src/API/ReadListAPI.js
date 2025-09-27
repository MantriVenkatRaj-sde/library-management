import { apiClient } from "./apiClient";

//Add to ReadersList
export function addToReadersList(username,isbn){
   return apiClient.post(`/users/${encodeURIComponent(username)}/books/isbn/${encodeURIComponent(isbn)}`,{});
}
export function removeFromReadersList(username,isbn){
    const readStatus='Abandoned'
     return apiClient.put(`/users/${encodeURIComponent(username)}/books/isbn/${encodeURIComponent(isbn)}/${encodeURIComponent(readStatus)}`,{});
}