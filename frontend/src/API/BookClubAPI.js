import apiClient from './apiClient';

export function getBookClubs() {
  return apiClient.get('/bookclubs/getall');
}

export function createClub(clubRequest) {
  return apiClient.post('/bookclubs/create',clubRequest);
}

export function recommendClubs(isbn) {
  return apiClient.get(`/bookclubs/recommend/${isbn}`);
}

export function getClub(clubname) {
  return apiClient.get(`/bookclubs/getclub/${clubname}`);
}

export function getClubMessages(clubname) {
  return apiClient.get(`/bookclubs/${clubname}/getmessages`);
}

export function getClub(clubname,username) {
  return apiClient.get(`/bookclubs/${clubname}/join/${username}`);
}
