/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function decodeBase64URL(value: string): string {
    try {
        // atob is present in all browsers and nodejs >= 16
        // but if it is not it will throw a ReferenceError in which case we can try to use Buffer
        // replace are here to convert the Base64-URL into Base64 which is what atob supports
        // replace with //g regex acts like replaceAll
        // Decoding base64 to UTF8 see https://stackoverflow.com/a/30106551/17622044
        return decodeURIComponent(
            atob(value.replace(/[-]/g, "+").replace(/[_]/g, "/"))
                .split("")
                .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
                .join(""),
        );
    } catch (e) {
        if (e instanceof ReferenceError) {
            // running on nodejs < 16
            // Buffer supports Base64-URL transparently
            return Buffer.from(value, "base64").toString("utf-8");
        }
        throw e;
    }
}

// Taken from: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export function decodeJWTPayload(token: string): Record<string, unknown> {
    const parts = token.split(".");

    if (parts.length !== 3) {
        throw new Error("JWT is not valid: not a JWT structure");
    }

    const base64Url = parts[1];
    const decodedPayload = decodeBase64URL(base64Url as string);
    try {
        return JSON.parse(decodedPayload);
    } catch (e) {
        throw new Error("Invalid JWT: Payload is not valid JSON");
    }
}

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
    const names = name.split(" ");
    const firstName = names[0] ?? "";
    const lastName = names[names.length - 1] ?? "";

    return firstName.charAt(0) + lastName.charAt(0);
}

export function sentenceCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatUsd(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
}

interface EmptyAchievementProps {
    id: string;
    title: string;
    total: number;
    textColor: string;
    bgColor: string;
}

export const emptyAchievement = [
    { id: "review", title: "Review", total: 60, textColor: "#A05E03", bgColor: "#FFEFD7" },
    { id: "referral", title: "Referral", total: 20, textColor: "#0065D0", bgColor: "#C9F0FF" },
    { id: "five-star", title: "5 Star Job", total: 10, textColor: "#198155", bgColor: "#ECFCE5" },
    { id: "squad", title: "Squad", total: 10, textColor: "#D3180C", bgColor: "#FFE5E5" },
];

export type AchievementType = "review" | "referral" | "five-star" | "squad";

export const getAchievementData = (type: AchievementType): EmptyAchievementProps | undefined => {
    return emptyAchievement.find(({ id }) => id === type);
};

interface ColorResult {
    circleColor: string;
    bgColor: string;
}

export const colorFromScore = (score: number): ColorResult => {
    if (score >= 0 && score <= 20)
        return { circleColor: "linear-gradient(149deg, #FA042F 0%, #FF6A84 100%)", bgColor: "#FFF8F8" };
    if (score >= 21 && score <= 35)
        return { circleColor: "linear-gradient(171deg, #FFF70A 0%, #EEE600 100%)", bgColor: "#FFFFF0" };
    if (score >= 36 && score <= 50)
        return { circleColor: "linear-gradient(166deg, #FFB402 0%, #E19E00 100%)", bgColor: "#FFFFF0" };
    if (score >= 51 && score <= 79)
        return { circleColor: "linear-gradient(162deg, #08A7FC 0%, #71CDFF 100%)", bgColor: "#F2FBFF" };
    return { circleColor: "linear-gradient(145deg, #05BD2F 0%, #0FF143 100%)", bgColor: "#ECFCE5" };
};

export const limitString = (str: string, limit: number = 10): string =>
    str.length > limit ? `${str.slice(0, limit)}...` : str;

export const createQueryString = (name: string, value: string): string => {
    const params = new URLSearchParams();
    params.set(name, value);
    return params.toString();
};

type CreateQueryStringsParams = Array<{ name: string; value: string }>;

export const createQueryStrings = (opts: CreateQueryStringsParams): string => {
    const params = new URLSearchParams();
    opts.forEach((opt) => {
        params.set(opt.name, opt.value);
    });
    return params.toString();
};

type CreateQueryStringsOpts = Record<string, string>;

export const createQueryStrings2 = (opts: CreateQueryStringsOpts): string => {
    const params = new URLSearchParams();
    Object.keys(opts).forEach((key) => {
        const value = opts[key];
        if (value !== undefined) {
            params.set(key, value);
        }
    });
    return params.toString();
};

export const parseFilterObjectToString = (filterData: Record<string, unknown>): string => {
    let qString = "";
    let prev = "";
    const newData = filterData;
    Object.keys(newData).forEach((key) => {
        const value = newData[key];
        if (value !== undefined && value !== null && typeof value === "string" && value !== "") {
            if (qString !== "") prev = "&";
            qString += `${prev}${createQueryString(key, value)}`;
        }
    });
    return qString;
};

export const formatCountdown = (counter: number): string => {
    const minutes = Math.floor(counter / 60);
    const seconds = counter % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY ?? "auth-token";
export const TEMP_AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_TEMP_AUTH_TOKEN_KEY ?? "temp-auth-token";

export const uniqueItems: <T>(arr: T[]) => T[] = (arr) => {
    return [...new Set(arr)];
};

export const FEED_TYPES = {
    COLLECTION_CREATED: "collection_created",
    COLLECTION_INVITE: "collection_invite",
    REFERRAL_SIGNUP: "referral_signup",
    REFERRAL_COLLECTION_COMPLETION: "referral_job_completion",
    COLLECTION_UPDATE: "collection_update",
    COLLECTION_DELIVERED: "collection_delivered",
    COLLECTION_COMPLETED: "collection_completed",
    COLLECTION_REVIEWED: "collection_reviewed",
    COLLECTION_CANCELLED: "collection_cancelled",
    COLLECTION_INVITE_FILLED: "collection_invite_filled",
    COLLECTION_INVITE_ACCEPTED: "collection_invite_accepted",
    COLLECTION_INVITE_REJECTED: "collection_invite_rejected",
    COLLECTION_INVITE_CANCELLED: "collection_invite_cancelled",
    ISSUE_RAISED: "issue_resolution_raise",
    JURY_INVITATION: "jury_invitation",
    ISSUE_RESOLUTION_GUILTY: "issue_resolution_guilty",
    ISSUE_RESOLUTION_GUILTY_SECOND: "second_issue_resolution_guilty",
    ISSUE_RESOLUTION_RESOLVED: "issue_resolution_resolve",

    PUBLIC_JOB_CREATED: "public_job_created",
    JOB_APPLICATION_SUBMITTED: "job_application_submitted",
    JOB_INVITATION_RECEIVED: "job_invitation_received",
    PUBLIC_JOB_FILLED: "public_job_filled",
    JOB_DELIVERABLE_UPDATE: "job_deliverable_update",
    JOB_INVITATION_ACCEPTED: "job_invitation_accepted",
    JOB_INVITATION_DECLINED: "job_invitation_declined",
    JOB_COMPLETION: "job_Completion",
    JOB_CANCELLED: "job_cancelled",
    JOB_CANCELLED_REQUEST: "job_cancelled_request",
    JOB_CANCELLED_ACCEPTED: "job_cancelled_accepted",
    JOB_REVIEW: "job_review",
    JOB_REVIEW_CHANGE: "job_review_change",
    JOB_REVIEW_CHANGE_ACCEPTED: "job_review_change_accepted",
    JOB_REVIEW_CHANGE_DECLINED: "job_review_change_declined",
    JOB_PAYMENT_RELEASED: "a_payment_released",
};

export function getAvatarColor(paktScore: number): string {
    if (paktScore <= 20) {
        return "#DC3545";
    }
    if (paktScore <= 40) {
        return "#F9D489";
    }
    if (paktScore <= 60) {
        return "#F2C94C";
    }
    if (paktScore <= 80) {
        return "#9BDCFD";
    }
    return "#28A745";
}

// from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

const allowedFileTypes = ["pdf", "doc", "ai", "avi", "docx", "csv", "ppt", "zip", "rar"];

interface PreviewResult {
    preview: string;
    type: string;
}

export function getPreviewByType(file: File): PreviewResult {
    const { type } = file;
    let preview;
    if (type.includes("image/")) {
        preview = URL.createObjectURL(file);
    } else {
        const typP = type.split("/")[1];
        if (typP && allowedFileTypes.includes(typP)) preview = `/images/thumbnail/${typP}.png`;
        else preview = "/images/thumbnail/TXT.png";
    }
    return { preview, type };
}

export function getPreviewByTypeUrl(url: string, type: string): PreviewResult {
    let preview;
    if (type.includes("image/") || type === "image") {
        preview = url;
    } else {
        const typP = type.split("/")[1];
        if (typP && allowedFileTypes.includes(typP)) preview = `/images/thumbnail/${typP}.png`;
        else preview = "/images/thumbnail/TXT.png";
    }
    return { preview, type };
}

export const CopyText = async (text: string): Promise<void> => navigator.clipboard.writeText(text);

// eslint-disable-next-line no-useless-escape
export const spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

export const paginate = <T>(array: T[], itemsPerPage: number, currentPage: number): T[] => {
    return array.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
};

export const truncate = (str: string, n: number): string => {
    return str.length > n ? `${str.slice(0, n - 1)}...` : str;
};

export function filterEmptyStrings(arr: string[]): string[] {
    return arr.filter((value) => {
        return value !== "";
    });
}

export const lowerCase = (str: string): string => {
    return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
