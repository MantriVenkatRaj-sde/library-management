import {apiClient} from './apiClient';

export function getBookClubsApi() {
  return apiClient.get('/bookclubs/getall');
}

export function createClubApi(clubRequest) {
  return apiClient.post('/bookclubs/create',clubRequest);
}

export function recommendClubsApi(isbn) {
  return apiClient.get(`/bookclubs/recommend/${isbn}`);
}

export function getClubApi(clubName,username) {
  const safe = encodeURIComponent(clubName || "");
  const safe2 = encodeURIComponent(username || "");
  console.log("safe1",safe)
  console.log("safe2",safe2)
  return apiClient.get(`/bookclubs/getclub/${safe}`,{params:{username:safe2}});
}

export function getClubMessagesApi(clubname) {
  return apiClient.get(`/bookclubs/${encodeURI(clubname)}/getmessages`);
}

export function joinClubApi(clubname,username) {
  return apiClient.post(`/bookclubs/${clubname}/join/${username}`);
}

