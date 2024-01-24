/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as z from "zod";

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character.");

export const otpSchema = z.object({
    otp: z.string().min(6, { message: "OTP is required" }),
});

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    });

export const loginSchema = z.object({
    password: z.string().min(1, "Password is required").min(8, "Password is too short"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
});

export const signupSchema = z
    .object({
        lastName: z.string().min(1, { message: "Name is required" }),
        firstName: z.string().min(1, { message: "Name is required" }),
        email: z.string().min(1, { message: "Email is required" }).email("Please enter a valid email address."),
        password: passwordSchema,
        confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    });

export const referralSchema = z.object({
    emails: z.array(z.string()).nonempty({ message: "emails are required" }),
});

export const editProfileFormSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    title: z.string().min(1, "Job Title is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    bio: z.string().min(1, "Bio is required"),
    location: z.string().min(1, "Location is required"),
    country: z.string().min(1, "Country is required"),
    tags: z
        .array(z.string())
        .min(3, "Minimum of 3 skills are required")
        .max(10, "Maximum of 10 skills are required")
        .nonempty({ message: "skills are required" }),
    isPrivate: z.boolean().default(false).optional(),
});

export const changePasswordFormSchema = z
    .object({
        currentPassword: z.string().min(1, "Current Password is required"),
        newPassword: z
            .string()
            .min(1, "New Password is required")
            .regex(
                // eslint-disable-next-line no-useless-escape
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character",
            ),
        confirmNewPassword: z.string().min(1, "Confirm New Password is required"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords don't match",
        path: ["confirmNewPassword"],
    });

export const withdrawFormSchema = z.object({
    coin: z.string().min(1, "Password is required"),
    address: z.string().min(1, "Address is required"),
    amount: z.number().min(1, "$100 is the minimum required amount for withdrawal"),
    password: z.string().min(1, "password is required"),
    confirm: z.literal(true, {
        errorMap: () => ({ message: "You must accept Terms and Conditions" }),
    }),
});

export const createJobSchema = z.object({
    due: z.date({
        required_error: "Due date is required",
    }),
    visibility: z.string().nonempty({ message: "Required" }),
    thirdSkill: z.string().optional().default(""),
    secondSkill: z.string().optional().default(""),
    firstSkill: z.string().nonempty({ message: "At least, one skill is required" }),
    budget: z.coerce.number().min(100, { message: "Budget must be at least $100" }),
    title: z.string().nonempty({ message: "Job title is required" }),
    description: z.string().nonempty({ message: "Job description is required" }),
    category: z.string().nonempty({ message: "Required" }),
    deliverables: z
        .array(z.string(), {
            required_error: "At least, one deliverable is required",
        })
        .max(5, {
            message: "You can add up to 5 deliverables",
        }),
});
