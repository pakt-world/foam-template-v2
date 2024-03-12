const Elements = ({
	colorCodes,
}: {
	colorCodes: string;
}): React.JSX.Element => {
	return (
		<>
			<div
				className="top absolute left-[-20%] top-[-20%] h-[150px] w-[150px] rounded-full"
				style={{ background: colorCodes }}
			/>
			<div
				className="bottom absolute right-[-20%] top-[42%] h-[150px] w-[150px] rounded-full"
				style={{ background: colorCodes }}
			/>
		</>
	);
};

export default Elements;
