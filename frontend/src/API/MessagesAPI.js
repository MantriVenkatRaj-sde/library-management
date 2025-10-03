import { apiClient } from "./apiClient";

export function getClubMessagesSinceApi(clubname,username,sinceId) {
  const encoded = encodeURIComponent(clubname || "");
  const url = `/chat/clubs/${encoded}/latestmessages/${encodeURIComponent(username)}`;
  return apiClient
    .get(url, { params: sinceId != null ? { sinceId } : {} })
    .then((res) => res.data);
}

export async function getClubAllMessagesApi(clubname,username){
    return await apiClient.get(`/chat/clubs/${encodeURIComponent(clubname)}/allmessages/${encodeURIComponent(username)}`);
}

export async function getUnreadMessages(username){
    return await apiClient.get(`/chat/${encodeURIComponent(username)}/messages/unread`);
}

export async function markClubAsRead(username,clubname){
    return await apiClient.get(`/chat/members/${encodeURIComponent(username)}/clubs/${encodeURIComponent(clubname)}/mark-read`);
}

export async function postMessageViaRest(payload){
    return await apiClient.post(`/chat/messages`,payload);
}

