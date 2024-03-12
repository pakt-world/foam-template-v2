import { type Config } from "tailwindcss";

import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssRadix from "tailwindcss-radix";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		screens: {
			sm: { min: "640px" },
			md: { min: "768px" },
			lg: { min: "1024px" },
			xl: { min: "1280px" },
			"2xl": { min: "1536px" },
			"2xl.max": { min: "1600px" },
		},
		extend: {
			colors: {
				info: "#17A2B8",
				secondary: "#7DDE86",
				"blue-lighter": "#9BDCFD",
				"blue-lightest": "#C9F0FF",
				"blue-darkest": "#0065D0",
				sky: "rgba(205, 207, 208, 1)",
				line: "rgba(232, 232, 232, 1)",
				title: "#1F2739",
				body: "#6C757D",
				warning: "#F2C94C",
				success: "#28A745",
				danger: "#DC3545",
				primary: "#007C5B",
				"primary-darker": "#23C16B",
				"primary-brighter": "#ECFCE5",
				"success-lighter": "rgba(39, 174, 96, 0.1)",
				yellow: "#F9D489",
				"yellow-dark": "#F2C94C",
				preference: "rgba(133, 133, 133, 0.1)",
				"refer-border": "#E8E8E8",
				"refer-bg": "#F9F9F9",
				"input-bg": "#FCFCFD",
				"sky-lighter": "#F7F9FA",
			},
			backgroundImage: {
				"auth-gradient":
					"linear-gradient(180deg, #007C5B 0%, #00231A 100%)",
				"sidebar-gradient":
					"linear-gradient(180deg, #007C5B 0%, #00231A 100%)",
				"primary-gradient":
					"linear-gradient(102.28deg, #008D6C 32.23%, #11FFC7 139.92%)",
				"red-gradient":
					"linear-gradient(149deg, #FA042F 0%, #FF6A84 100%)",
				"yellow-gradient":
					"linear-gradient(171deg, #FFF70A 0%, #EEE600 100%)",
				"orange-gradient":
					"linear-gradient(166deg, #FFB402 0%, #E19E00 100%)",
				"blue-gradient":
					"linear-gradient(162deg, #08A7FC 0%, #71CDFF 100%)",
				"green-gradient":
					"linear-gradient(145deg, #05BD2F 0%, #0FF143 100%)",
				"gradient-leaderboard":
					"linear-gradient(360deg, #007C5B 0%, #00231A 100%)",
				"blur-bg": 'url("/images/backbg.svg")',
				"pakt-score-gradient":
					"conic-gradient(from 180deg at 50.00% 50.00%, #61C454 0.048630565870553255deg, #03A328 0.8480448368936777deg, #00BA2A 24.784035086631775deg, #18CD42 40.25028795003891deg, #35E45D 50.94634473323822deg, #35E45D 60.361735224723816deg, #0079AE 71.8717110157013deg, #04A4FC 105.73829054832458deg, #2CCCF9 123.79844069480896deg, #63D2EA 138.19416761398315deg, #FFA500 155.15244483947754deg, #FFC203 192.3530101776123deg, #FFF50A 230.82940578460693deg, #FFF90A 284.43509101867676deg, #FFC0CB 292.38030910491943deg, #FA1039 316.4574694633484deg, #FA002C 359.07697677612305deg)",
				none: "none",
			},
			fontFamily: {
				sans: ["var(--circular-std-font)", ...fontFamily.sans],
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [tailwindcssRadix, tailwindcssAnimate],
};

export default config;
