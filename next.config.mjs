/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
		APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
		APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
		APPWRITE_WORKSPACES_COLLECTION_ID: process.env.APPWRITE_WORKSPACES_COLLECTION_ID,
		APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
	},
};

export default nextConfig;
