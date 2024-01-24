/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

// Error Service

interface ErrorData {
    title: string;
    message: unknown;
}

interface ErrorServiceState {
    errorMessage: ErrorData;
    setErrorMessage: (errorMessage: ErrorData) => void;
}

export const useErrorService = create<ErrorServiceState>((set) => ({
    errorMessage: {
        title: "",
        message: "",
    },
    setErrorMessage: (errorMessage: ErrorData) => {
        set({ errorMessage });
    },
}));
