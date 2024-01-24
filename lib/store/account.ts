import { create } from "zustand";
import { type User } from "@/lib/types";

type UserState = User & {
    setUser: (user: User) => void;
};

export const useUserState = create<UserState>()((set) => ({
    _id: "",
    type: "",
    email: "",
    lastName: "",
    firstName: "",
    score: 0,
    profileImage: {
        url: "",
    },
    profileCompleteness: 0,
    profile: {
        talent: {
            tagIds: [],
            availability: "",
            tags: [],
        },
    },
    twoFa: {
        status: false,
        type: "",
    },
    setUser: (user: User) => {
        set(user);
    },
}));
