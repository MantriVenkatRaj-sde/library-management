import { apiClient } from "./apiClient";

export function getAllBooks(page,size){
    return apiClient.get(`/all-books`,{params:{page:page,size:size}});
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

export function findBooksByGenre(genre,page,size) {
    return apiClient.get(`/${genre}/books`,{params:{page:page,size:size}});
}

export function searchQuery(query,page,size) {
    return apiClient.get(`/books/search/${query}`,{params:{page:page,size:size}});
}

export function postReviewAndRating(username,isbn,rating,review){
    const req={rating:rating,review:review}
    return apiClient.post(`/users/${encodeURIComponent(username)}/books/${encodeURIComponent(isbn)}/add-rating`,req)
}
export function getBookRatings(isbn,page,size){
  return apiClient.get(`/book/${encodeURIComponent(isbn)}/ratings`,{params:{page:page,size:size}})
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