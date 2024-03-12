/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

// App2FA
interface AuthApp2FA {
	isModalOpen: boolean;
	closeModal: () => void;
	openModal: () => void;
	secret: string;
	setSecret: (secret: string) => void;
	qrCode: string;
	setQrCode: (qrCode: string) => void;
}

export const useAuthApp2FAState = create<AuthApp2FA>((set) => ({
	isModalOpen: false,
	openModal: () => {
		set({ isModalOpen: true });
	},
	closeModal: () => {
		set({ isModalOpen: false });
	},
	secret: "",
	setSecret: (secret: string) => {
		set({ secret });
	},
	qrCode: "",
	setQrCode: (qrCode: string) => {
		set({ qrCode });
	},
}));

// Email 2FA state
interface Email2FAState {
	isModalOpen: boolean;
	closeModal: () => void;
	openModal: () => void;
}

export const useEmail2FAState = create<Email2FAState>((set) => ({
	isModalOpen: false,
	openModal: () => {
		set({ isModalOpen: true });
	},
	closeModal: () => {
		set({ isModalOpen: false });
	},
}));

// Security Question State
interface SecurityQuestion2FAState {
	isModalOpen: boolean;
	securityQuestions: string[];
	setSecurityQuestions: (securityQuestions: string[]) => void;
	closeModal: () => void;
	openModal: () => void;
}

export const useSecurityQuestion2FAState = create<SecurityQuestion2FAState>(
	(set) => ({
		isModalOpen: false,
		securityQuestions: [],
		setSecurityQuestions: (securityQuestions: string[]) => {
			set({ securityQuestions });
		},
		openModal: () => {
			set({ isModalOpen: true });
		},
		closeModal: () => {
			set({ isModalOpen: false });
		},
	}),
);

interface MscState {
	isInput6DigitCode?: boolean;
	setIsInput6DigitCode?: (value: boolean) => void;
}

export const useMscState = create<MscState>((set) => ({
	isInput6DigitCode: false,
	setIsInput6DigitCode: (value) => {
		set(() => ({ isInput6DigitCode: value }));
	},
}));
