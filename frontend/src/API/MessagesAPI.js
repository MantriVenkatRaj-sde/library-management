import { apiClient } from "./apiClient";

export function getClubMessagesSinceApi(clubname, sinceId) {
  const encoded = encodeURIComponent(clubname || "");
  const url = `/chat/clubs/${encoded}/latestmessages`;
  return apiClient
    .get(url, { params: sinceId != null ? { sinceId } : {} })
    .then((res) => res.data);
}

export async function getClubAllMessagesApi(clubname){
    return await apiClient.get(`/chat/clubs/${clubname}/allmessages`);
}

export async function getUnreadMessages(username){
    return await apiClient.get(`/chat/members/${username}/unread`);
}

export async function markClubAsRead(username,clubname){
    return await apiClient.get(`/chat/members/${username}/clubs/${clubname}/mark-read`);
}

export async function postMessageViaRest(payload){
    return await apiClient.post(`/chat/messages`,payload);
}

