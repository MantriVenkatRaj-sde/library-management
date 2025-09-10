import { apiClient } from "./apiClient";

export function getAllBooks(){
    return apiClient.get(`/all-books`);
}

export function findByAuthor(author) {
    return apiClient.get(`/by-author/${author}`);
}

export function findByBookTitle(title) {
    return apiClient.get(`/by-title/${title}`);
}

export function findByGenre(genre) {
    return apiClient.get(`/by-genre/${genre}`);
}

export function findBookByISBN(isbn) {
    return apiClient.get(`/book/${isbn}`);
}
