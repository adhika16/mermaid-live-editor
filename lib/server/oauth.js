// src/lib/server/oauth.js
"use server";

import { createAdminClient } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

// Get the app URL from environment or construct from headers
function getAppUrl() {
	// First, try to use the configured environment variable
	const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
	if (appUrl) {
		console.log("[OAuth] Using NEXT_PUBLIC_APP_URL:", appUrl);
		return appUrl;
	}

	// Try host header as fallback for production
	const headersList = headers();
	const host = headersList.get("host");
	const proto = headersList.get("x-forwarded-proto") || "https";
	
	if (host) {
		const url = `${proto}://${host}`;
		console.log("[OAuth] Using host header:", url);
		return url;
	}

	// Final fallback to origin header
	const origin = headersList.get("origin");
	if (origin) {
		console.log("[OAuth] Using origin header:", origin);
		return origin;
	}

	// Throw error if we cannot determine the URL
	const errorMsg = `Could not determine app URL. Please set NEXT_PUBLIC_APP_URL environment variable. Checked: NEXT_PUBLIC_APP_URL=${process.env.NEXT_PUBLIC_APP_URL || "undefined"}`;
	console.error("[OAuth] " + errorMsg);
	throw new Error(errorMsg);
}

export async function signUpWithGithub() {
	try {
		const { account } = await createAdminClient();

		const appUrl = getAppUrl();
		const redirectUrl = await account.createOAuth2Token({
			provider: OAuthProvider.Github,
			success: `${appUrl}/oauth`,
			failure: `${appUrl}/login`,
		});

		console.log("[OAuth] GitHub redirect URL generated successfully");
		return redirect(redirectUrl);
	} catch (error) {
		console.error("[OAuth] GitHub error:", error.message);
		throw error;
	}
}

export async function signUpWithGoogle() {
	try {
		const { account } = await createAdminClient();

		const appUrl = getAppUrl();
		const redirectUrl = await account.createOAuth2Token({
			provider: OAuthProvider.Google,
			success: `${appUrl}/oauth`,
			failure: `${appUrl}/login`,
		});

		console.log("[OAuth] Google redirect URL generated successfully");
		return redirect(redirectUrl);
	} catch (error) {
		console.error("[OAuth] Google error:", error.message);
		throw error;
	}
}
