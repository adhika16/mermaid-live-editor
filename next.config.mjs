/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
		APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
		APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
		APPWRITE_WORKSPACES_COLLECTION_ID: process.env.APPWRITE_WORKSPACES_COLLECTION_ID,
	},
};

export default nextConfig;
