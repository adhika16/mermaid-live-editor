// src/lib/server/oauth.js
"use server";

import { createAdminClient } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { OAuthProvider } from "node-appwrite";

// Get the app URL from environment or construct from headers
function getAppUrl() {
	// First, try to use the configured environment variable
	if (process.env.NEXT_PUBLIC_APP_URL) {
		return process.env.NEXT_PUBLIC_APP_URL;
	}

	// Fallback to headers for development
	const origin = headers().get("origin");
	if (origin) {
		return origin;
	}

	// Final fallback (shouldn't happen in normal circumstances)
	throw new Error("Could not determine app URL. Please set NEXT_PUBLIC_APP_URL environment variable.");
}

export async function signUpWithGithub() {
	const { account } = await createAdminClient();

	const appUrl = getAppUrl();

	const redirectUrl = await account.createOAuth2Token({
		provider: OAuthProvider.Github,
		success: `${appUrl}/oauth`,
		failure: `${appUrl}/login`,
	});

	return redirect(redirectUrl);
}

export async function signUpWithGoogle() {
	const { account } = await createAdminClient();

	const appUrl = getAppUrl();

	const redirectUrl = await account.createOAuth2Token({
		provider: OAuthProvider.Google,
		success: `${appUrl}/oauth`,
		failure: `${appUrl}/login`,
	});

	return redirect(redirectUrl);
}
