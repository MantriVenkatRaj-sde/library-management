import { apiClient } from "./apiClient";
export function getUserMembershipApi(username) {
    return apiClient.get(`/${encodeURI(username)}/membership`);
}