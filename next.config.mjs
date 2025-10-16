/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
		APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
	},
};

export default nextConfig;
