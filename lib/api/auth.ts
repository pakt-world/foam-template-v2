/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult, useMutation } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { toast } from "@/components/common/toaster";
import { type ApiError, axios } from "@/lib/axios";
import { useUserState } from "../store/account";
import { useWalletState } from "../store/wallet";

// Signup

interface SignupResponse {
    email: string;
    tempToken: {
        token: string;
        expiresIn: number;
    };
}

interface SignupParams {
    email: string;
    password: string;
    lastName: string;
    firstName: string;
    referral?: string;
}

async function postSignUp({ email, password, firstName, lastName, referral }: SignupParams): Promise<SignupResponse> {
    const res = await axios.post("/auth/create-account", {
        email,
        password,
        lastName,
        firstName,
        referral,
    });
    return res.data.data as SignupResponse;
}

export function useSignUp(): UseMutationResult<SignupResponse, ApiError, SignupParams> {
    return useMutation({
        mutationFn: postSignUp,
        mutationKey: ["signup"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

// Verify Email

interface VerifyEmailResponse {
    token: string;
    expiresIn: number;
}

interface VerifyEmailParams {
    otp: string;
    token: string;
}

async function postVerifyEmail({ otp, token }: VerifyEmailParams): Promise<VerifyEmailResponse> {
    const res = await axios.post("/auth/account/verify", { token: otp, tempToken: token });
    return res.data.data as VerifyEmailResponse;
}

export function useVerifyEmail(): UseMutationResult<VerifyEmailResponse, ApiError, VerifyEmailParams> {
    return useMutation({
        mutationFn: postVerifyEmail,
        mutationKey: ["verify-email"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

// Resend OTP

interface ResendOTPResponse {
    token: string;
    expiresIn: number;
}

interface ResendOTPParams {
    email: string;
}

async function postResendOTP({ email }: ResendOTPParams): Promise<ResendOTPResponse> {
    const res = await axios.post("/auth/verify/resend", { email });
    return res.data.data as ResendOTPResponse;
}

export function useResendOTP(): UseMutationResult<ResendOTPResponse, ApiError, ResendOTPParams> {
    return useMutation({
        mutationFn: postResendOTP,
        mutationKey: ["resend-otp"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
        onSuccess: () => {
            toast.success("OTP sent successfully");
        },
    });
}

// Login
interface LoginResponse {
    email: string;
    token: string;
    isVerified: boolean;
    tempToken?: {
        token: string;
    };
    twoFa?: {
        status: true;
        type: string;
    };
    _id: string;
}

interface LoginParams {
    email: string;
    password: string;
}
interface Login2FAParams {
    code: string;
    tempToken: string;
}

async function postLogin({ email, password }: LoginParams): Promise<LoginResponse> {
    const res = await axios.post("/auth/login", { email, password });
    return res.data.data as LoginResponse;
}

async function postLogin2FA({ code, tempToken }: Login2FAParams): Promise<LoginResponse> {
    const res = await axios.post("/auth/login/2fa", { code, tempToken });
    return res.data.data as LoginResponse;
}

export function useLogin(): UseMutationResult<LoginResponse, ApiError, LoginParams> {
    const { setUser } = useUserState();
    const { setWallet } = useWalletState();
    return useMutation({
        mutationFn: postLogin,
        mutationKey: ["login"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
        onSuccess: (data) => {
            setUser(data);
            setWallet({ totalWalletBalance: "0.00", value: "0.00", wallets: [] });
        },
    });
}

export function useLoginOTP(): UseMutationResult<LoginResponse, ApiError, Login2FAParams> {
    const { setUser } = useUserState();
    return useMutation({
        mutationFn: postLogin2FA,
        mutationKey: ["login_2fa"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
        onSuccess: (data) => {
            setUser(data);
        },
    });
}

// reset Password

interface ResetPasswordParams {
    email: string;
}

interface ResetPasswordResponse {
    message: string;
    tempToken: {
        token: string;
        expiresIn: number;
    };
}

async function postRequestPasswordReset({ email }: ResetPasswordParams): Promise<ResetPasswordResponse> {
    const res = await axios.post("/auth/password/reset", { email });
    return res.data.data as ResetPasswordResponse;
}

export function useRequestPasswordReset(): UseMutationResult<ResetPasswordResponse, ApiError, ResetPasswordParams> {
    return useMutation({
        mutationFn: postRequestPasswordReset,
        mutationKey: ["request-reset-password"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

interface VerifyResetPasswordParams {
    token: string;
    tempToken: string;
}

interface VerifyResetPasswordResponse {
    message: string;
    tempToken: {
        token: string;
        expiresIn: number;
    };
}

async function postVerifyPasswordReset({
    tempToken,
    token,
}: VerifyResetPasswordParams): Promise<VerifyResetPasswordResponse> {
    const res = await axios.post("/auth/password/validate", { tempToken, token });
    return res.data.data as VerifyResetPasswordResponse;
}

export function useVerifyResetPassword(): UseMutationResult<
    VerifyResetPasswordResponse,
    ApiError,
    VerifyResetPasswordParams
> {
    return useMutation({
        mutationFn: postVerifyPasswordReset,
        mutationKey: ["verify-reset-password"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}

interface ResetAccountPasswordParams {
    token: string;
    tempToken: string;
    password: string;
}

interface ResetAccountPasswordResponse {
    message: string;
}

async function postAccountPasswordReset({
    tempToken,
    token,
    password,
}: ResetAccountPasswordParams): Promise<ResetAccountPasswordResponse> {
    const res = await axios.post("/auth/password/change", { tempToken, token, password });
    return res.data.data as ResetAccountPasswordResponse;
}

export function useResetPassword(): UseMutationResult<
    ResetAccountPasswordResponse,
    ApiError,
    ResetAccountPasswordParams
> {
    return useMutation({
        mutationFn: postAccountPasswordReset,
        mutationKey: ["account-reset-password"],
        onError: (error: ApiError) => {
            toast.error(error?.response?.data.message ?? "An error occurred");
        },
    });
}
