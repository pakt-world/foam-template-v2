/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Axios, { type AxiosError, type AxiosResponse } from "axios";
import { deleteCookie } from "cookies-next";
import { redirect } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { AUTH_TOKEN_KEY } from "./utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axios = Axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const axiosDefault = Axios.create({
    headers: { "Access-Control-Allow-Origin": "*" },
    responseType: "blob",
});

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        // console.log("status-code==>:", error.response.status, error.response.status === 401);
        if (error.response.status === 401) {
            deleteCookie(AUTH_TOKEN_KEY);
            if (window) {
                window.location.replace("/login");
            } else {
                redirect("login");
            }
            return;
        }
        return Promise.reject(error);
    },
);

export type ApiResponse<T = unknown> = AxiosResponse<{
    message: string;
    data: T;
}>;

export type ApiError<T = unknown> = AxiosError<{
    message: string;
    data?: T;
}>;
