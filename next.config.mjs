/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.externals.push({
				bufferutil: "bufferutil",
				"utf-8-validate": "utf-8-validate",
			});
		}
		return config;
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
				port: "",
			},
		],
	},
};

export default nextConfig;
