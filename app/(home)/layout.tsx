interface Props {
	children: React.ReactNode;
}

export default function HomeLayout({ children }: Props): React.JSX.Element {
	return <main className="flex min-h-screen flex-col">{children}</main>;
}
