"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactNode, useState, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useIdleTimer } from "react-idle-timer";
import { Button } from "pakt-ui";
import { formatDistance } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetAccount } from "@/lib/api/account";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { MessagingProvider } from "@/providers/socketProvider";
import { axios } from "@/lib/axios";
import { Modal } from "@/components/common/headless-modal";
import { Sidebar } from "@/components/sidebar";
import { PageLoading } from "@/components/common/page-loading";

function Loader(): React.JSX.Element {
	return (
		<div
			aria-live="polite"
			aria-busy="true"
			className="flex h-screen w-screen items-center justify-center"
		>
			<PageLoading color="#007C5B" />
		</div>
	);
}

interface DashProps {
	children: ReactNode;
	// eslint-disable-next-line react/require-default-props
	tokenSet?: boolean;
}

function AccountWrapper({
	children,
	tokenSet = false,
}: DashProps): React.JSX.Element {
	const { isFetched, isFetching } = useGetAccount();

	if (!tokenSet || (!isFetched && isFetching)) {
		return <Loader />;
	}

	return children as React.JSX.Element;
}

const SIX_MINUTES_IN_MS = 6 * 60 * 1000;

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element {
	const router = useRouter();
	const queryClient = useQueryClient();
	const token = getCookie(AUTH_TOKEN_KEY) as string;
	const [isTokenSet, setIsTokenSet] = useState(false);

	const [remainingTime, setRemainingTime] = useState(0);
	const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);

	const onIdle = (): void => {
		setIsTimeoutModalOpen(false);
		queryClient.clear();
		router.push("/login");
		deleteCookie(AUTH_TOKEN_KEY);
	};

	const onActive = (): void => {
		setIsTimeoutModalOpen(false);
	};

	const onPrompt = (): void => {
		setIsTimeoutModalOpen(true);
	};

	const { getRemainingTime, activate } = useIdleTimer({
		onIdle,
		onActive,
		onPrompt,
		timeout: SIX_MINUTES_IN_MS,
		promptBeforeIdle: SIX_MINUTES_IN_MS / 2,
	});

	const stayActive = (): void => {
		setIsTimeoutModalOpen(false);
		setTimeout(() => {
			activate();
		}, 1000);
	};

	const Logout = (): void => {
		deleteCookie(AUTH_TOKEN_KEY);
		queryClient.clear();
		router.push("/login");
	};

	useEffect(() => {
		const intervalId = setInterval(() => {
			setRemainingTime(getRemainingTime());
		}, 10);

		return () => {
			clearInterval(intervalId);
		};
	}, [getRemainingTime]);

	useEffect(() => {
		if (token !== "") {
			axios.defaults.headers.common.Authorization = `Bearer ${token}`;
			setIsTokenSet(true);
		}
		return () => {
			axios.defaults.headers.common.Authorization = "";
		};
	}, [router, token]);

	if (!isTokenSet) {
		return <Loader />;
	}

	return (
		<AccountWrapper tokenSet={isTokenSet}>
			<MessagingProvider>
				<div className="flex h-screen w-screen max-w-full overflow-y-hidden">
					<Sidebar />

					<div className="relative w-full">
						<div className="absolute inset-0 z-[1]">
							<div className="isolate">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 1512 989"
									fill="none"
								>
									<g filter="url(#filter0_f_4656_140202)">
										<path
											d="M1008.86 223.475L841.933 115.026L749.197 169.251C728.59 187.326 687.374 230.983 687.374 261.015C687.374 298.555 684.283 361.121 687.374 381.977C690.465 402.832 841.933 473.741 875.936 469.57C909.939 465.399 1030.49 494.597 1079.95 548.821C1129.41 603.045 1132.5 628.072 1243.79 682.296C1355.07 736.52 1367.43 665.612 1407.62 628.072C1447.8 590.532 1475.62 448.714 1503.45 361.121C1531.27 273.528 1481.81 223.475 1475.63 169.251C1470.68 125.871 1413.8 115.026 1385.98 115.026L1243.79 90L1008.86 223.475Z"
											fill="#BCF78C"
											fillOpacity="0.5"
										/>
									</g>
									<defs>
										<filter
											id="filter0_f_4656_140202"
											x="-79.7596"
											y="-675.76"
											width="2357.39"
											height="2143.52"
											filterUnits="userSpaceOnUse"
											colorInterpolationFilters="sRGB"
										>
											<feFlood
												floodOpacity="0"
												result="BackgroundImageFix"
											/>
											<feBlend
												mode="normal"
												in="SourceGraphic"
												in2="BackgroundImageFix"
												result="shape"
											/>
											<feGaussianBlur
												stdDeviation="382.88"
												result="effect1_foregroundBlur_4656_140202"
											/>
										</filter>
									</defs>
								</svg>
							</div>
						</div>
						<div className="absolute inset-0 bg-[url(/images/rain.png)] bg-repeat opacity-50" />
						<Modal
							isOpen={isTimeoutModalOpen}
							closeModal={() => {}}
							disableClickOutside
						>
							<div className="flex w-full flex-col items-center gap-4 rounded-xl bg-white p-4 py-4 text-center">
								<h2 className="text-2xl font-bold">
									Session Expiring
								</h2>
								<p>
									Logging out{" "}
									<span className="">
										{formatDistance(remainingTime, 0, {
											includeSeconds: true,
											addSuffix: true,
										})}
									</span>
								</p>

								<div className="flex w-full items-center gap-1">
									<Button
										size="sm"
										fullWidth
										variant="secondary"
										className="scale-90"
										onClick={Logout}
									>
										Log Out
									</Button>
									<Button
										size="sm"
										fullWidth
										className="scale-95"
										onClick={stayActive}
									>
										Stay Active
									</Button>
								</div>
							</div>
						</Modal>
						<div className="relative isolate z-10 flex h-full flex-1 flex-col px-4 2xl:px-8 pt-5">
							{children}
						</div>
					</div>
				</div>
			</MessagingProvider>
		</AccountWrapper>
	);
}
