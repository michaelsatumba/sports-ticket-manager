/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	env: {
		CLIENT_ID: process.env.CLIENT_ID,
	},
};

module.exports = nextConfig;
