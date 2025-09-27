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

export function findBookByISBN(isbn) {
    return apiClient.get(`/book/${isbn}`);
}

export function findBooksByGenre(genre) {
    return apiClient.get(`/${genre}/books`);
}

export function searchQuery(query) {
    return apiClient.get(`/books/search/${query}`);
}

export function postReviewAndRating(username,isbn,rating,review){
    const req={rating:rating,review:review}
    return apiClient.post(`/users/${encodeURIComponent(username)}/books/${encodeURIComponent(isbn)}/add-rating`,req)
}
export function getBookRatings(isbn){
  return apiClient.get(`/book/${encodeURIComponent(isbn)}/ratings`)
}

export function getLikedBooks(username){
    return apiClient.get(`/user/${encodeURIComponent(username)}/liked`)
}

export function LikeABook(username,isbn){
    return apiClient.post(`/user/${encodeURIComponent(username)}/book/${encodeURIComponent(isbn)}/likeBook`,{})
}

export function UnLikeABook(username,isbn){
    return apiClient.delete(`/user/${encodeURIComponent(username)}/book/${encodeURIComponent(isbn)}/unlikeBook`,{})
}

export function deleteRating(username,isbn,ratingid){
    return apiClient.delete(`users/${encodeURIComponent(username)}/${encodeURIComponent(isbn)}/ratings/${ratingid}/delete`,{});
}