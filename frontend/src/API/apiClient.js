import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://bookcircle-sprinboot-server-alb-1527815027.ap-south-1.elb.amazonaws.com:8080"
});