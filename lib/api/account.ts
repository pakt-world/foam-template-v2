/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useQuery, useMutation, type UseMutationResult, type UseQueryResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type User } from "@/lib/types";
import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { useUserState } from "../store/account";

interface GetAccountResponse {
    _id: string;
    type: string;
    email: string;
    lastName: string;
    firstName: string;
    score: 0;
    profileImage: {
        url: string;
    };
    profileCompleteness: 0;
    profile: {
        talent: {
            tagIds?: [{ name: string; color: string }];
            availability: string;
            tags?: [];
            about: string;
        };
        bio: {
            title: string;
            description: string;
        };
        contact: {
            city: string;
            country: string;
        };
    };
    twoFa: {
        status?: boolean;
        type?: string;
    };
    isPrivate?: boolean;
}
interface UpdateAccountParams {
    firstName?: string;
    lastName?: string;
    profile?: {
        contact?: {
            state?: string;
            city?: string;
            phone?: string;
            address?: string;
            country?: string;
        };
        bio?: {
            title?: string;
            description?: string;
        };
        talent?: {
            availability?: string;
            tags?: string[];
        };
    };
    profileImage?: string;
    isPrivate?: boolean;
}

async function postUpdateAccount(values: UpdateAccountParams): Promise<User> {
    const res = await axios.patch("/account/update", values);
    return res.data.data;
}

export function useUpdateAccount(): UseMutationResult<User, ApiError, UpdateAccountParams, unknown> {
    return useMutation({
        mutationFn: postUpdateAccount,
        mutationKey: ["update_account_system"],
        onSuccess: () => {
            toast.success("Account updated successfully");
        },
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

async function fetchUserAccount(): Promise<User> {
    const res = await axios.get("/account");
    return res.data.data;
}

export const useGetAccount = (): UseQueryResult<GetAccountResponse, ApiError> => {
    const { setUser } = useUserState();
    return useQuery({
        queryFn: fetchUserAccount,
        queryKey: ["account-details"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
        onSuccess: (user: GetAccountResponse) => {
            setUser(user);
            return user;
        },
        // enabled: false,
    });
};

// ===

interface ChangePasswordParams {
    oldPassword: string;
    newPassword: string;
}

async function postChangePassword(values: ChangePasswordParams): Promise<void> {
    const res = await axios.put("/account/password/change", values);
    return res.data.data;
}

export function useChangePassword(): UseMutationResult<void, ApiError, ChangePasswordParams, unknown> {
    return useMutation({
        mutationFn: postChangePassword,
        mutationKey: ["change_password"],
        onSuccess: () => {
            toast.success("Account Password changed successfully");
        },
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

// ===

interface Initiate2FAParams {
    type: string;
}

interface Initiate2FAResponse {
    securityQuestions?: string[];
    qrCodeUrl?: string;
    secret?: string;
    type?: string;
}

async function postInitiate2FA(values: Initiate2FAParams): Promise<Initiate2FAResponse> {
    const res = await axios.post("/account/initiate/2fa", values);
    return res.data.data;
}

export function useInitialize2FA(): UseMutationResult<Initiate2FAResponse, ApiError, Initiate2FAParams, unknown> {
    return useMutation({
        mutationFn: postInitiate2FA,
        mutationKey: ["initialize_2fa_setup"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

// ===

interface ActivateDeactivate2FAParams {
    code: string;
    securityQuestion?: string;
}

async function postActivate2FA(values: ActivateDeactivate2FAParams): Promise<void> {
    const res = await axios.post("/account/activate/2fa", values);
    return res.data.data;
}

export function useActivate2FA(): UseMutationResult<void, ApiError, ActivateDeactivate2FAParams, unknown> {
    const { isFetching, refetch: fetchAccount } = useGetAccount();
    return useMutation({
        mutationFn: postActivate2FA,
        mutationKey: ["activate_2fa_setup"],
        onSuccess: async () => {
            if (!isFetching) await fetchAccount();
            toast.success("2FA successfully activated");
        },
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

// ===

async function postDeActivate2FA(values: ActivateDeactivate2FAParams): Promise<void> {
    const res = await axios.post("/account/deactivate/2fa", values);
    return res.data.data;
}

export function useDeActivate2FA(): UseMutationResult<void, ApiError, ActivateDeactivate2FAParams, unknown> {
    const { isFetching, refetch: fetchAccount } = useGetAccount();
    return useMutation({
        mutationFn: postDeActivate2FA,
        mutationKey: ["deactivate_2fa_setup"],
        onSuccess: async () => {
            if (!isFetching) await fetchAccount();
            toast.success("2FA successfully deactivated");
        },
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

// ===

async function postDeActivate2FAEmailInitiate(): Promise<void> {
    const res = await axios.post("/account/2fa/email");
    return res.data.data;
}

export function useDeActivate2FAEmailInitiate(): UseMutationResult<void, ApiError, void, unknown> {
    return useMutation({
        mutationFn: postDeActivate2FAEmailInitiate,
        mutationKey: ["deactivate_email_2fa_setup"],
        onSuccess: () => {
            toast.success("Email 2FA Code successfully Sent");
        },
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}
