/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.leonardo.ai',
				port: '',
			},
		],
	},
};

module.exports = nextConfig;
