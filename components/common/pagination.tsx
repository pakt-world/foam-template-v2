/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	totalPages: number;
	currentPage: number;
	setCurrentPage: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({
	currentPage,
	setCurrentPage,
	totalPages,
}) => {
	const BOUNDARY = 3;
	const MIN_PAGE = 1;
	const MAX_PAGE = Math.max(MIN_PAGE, totalPages);

	const leftPages: number[] = [];
	const rightPages: number[] = [];

	for (
		let i = Math.max(MIN_PAGE, currentPage - BOUNDARY);
		i < currentPage;
		i++
	) {
		leftPages.push(i);
	}

	for (
		let i = currentPage;
		i <= Math.min(MAX_PAGE, currentPage + BOUNDARY);
		i++
	) {
		rightPages.push(i);
	}

	return (
		<div className="flex items-center justify-between gap-2 text-sm">
			<div>{/* Page {currentPage} of {totalPages} */}</div>

			<div className="flex items-center gap-2">
				<button
					className="rounded-lg p-1 px-2 text-primary hover:bg-[#007C5B1A]"
					onClick={() => {
						setCurrentPage(currentPage - 1);
					}}
					disabled={currentPage === 1}
					aria-label="Back"
					type="button"
				>
					<ChevronLeft strokeWidth={1.5} size={20} />
				</button>

				{leftPages.length > 0 &&
					leftPages.map((page) => (
						<button
							key={page}
							className="rounded-lg bg-white p-1 px-3 text-sm text-primary hover:bg-[#007C5B1A]"
							onClick={() => {
								setCurrentPage(page);
							}}
							aria-label="Back"
							type="button"
						>
							{page}
						</button>
					))}

				{rightPages.length > 0 &&
					rightPages.map((page) => (
						<button
							key={page}
							className={`rounded-lg p-1 px-3  text-sm text-primary hover:bg-[#007C5B1A] ${
								currentPage === page
									? "bg-[#007C5B1A]"
									: "bg-white"
							}`}
							onClick={() => {
								setCurrentPage(page);
							}}
							aria-label="Back"
							type="button"
						>
							{page}
						</button>
					))}

				<button
					className="rounded-lg p-1 px-2 text-primary hover:bg-[#007C5B1A]"
					onClick={() => {
						setCurrentPage(currentPage + 1);
					}}
					disabled={currentPage === totalPages}
					aria-label="Back"
					type="button"
				>
					<ChevronRight strokeWidth={1.5} size={20} />
				</button>
			</div>
		</div>
	);
};
