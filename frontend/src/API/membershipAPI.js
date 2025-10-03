import { apiClient } from "./apiClient";

export function getUserMembershipApi(username) {
    return apiClient.get(`/${encodeURIComponent(username)}/membership`);
}

export function deleteUserMembershipApi(username,clubname) {
    return apiClient.delete(`/${encodeURIComponent(username)}/membership/${encodeURIComponent(clubname)}/remove`);
}

export function getClubMembers(username,clubname) {
    return apiClient.get(`/admin/${encodeURIComponent(username)}/club/${encodeURIComponent(clubname)}/members`);
}