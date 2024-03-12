"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React from "react";
import { clarity } from "react-microsoft-clarity";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
	children: React.ReactNode;
}

const CLARITY_ID = "k5s9fhhnjg";

export function Providers({ children }: Props): React.JSX.Element {
	const [queryClient] = React.useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {},
				},
			}),
	);

	React.useEffect(() => {
		clarity.init(CLARITY_ID);
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
