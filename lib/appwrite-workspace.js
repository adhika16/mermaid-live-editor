"use server";

import { Client, Databases, ID, Query, Permission, Role, Functions, Account, ExecutionMethod } from "node-appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const functions = new Functions(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const WORKSPACES_COLLECTION_ID = process.env.APPWRITE_WORKSPACES_COLLECTION_ID;
const EMAIL_PROCESSOR_FUNCTION_ID = process.env.APPWRITE_EMAIL_PROCESSOR_FUNCTION_ID;

/**
 * Save a new workspace or update an existing one
 * @param {string} userId - The user ID
 * @param {object} workspaceData - { title, description, mermaidCode, isPublic, workspaceId? }
 * @returns {Promise<object>} The saved workspace document
 */
export const saveWorkspace = async (userId, workspaceData) => {
  const {
    title,
    description = "",
    mermaidCode,
    isPublic = false,
    workspaceId = null,
  } = workspaceData;

  const documentId = workspaceId || ID.unique();
  const shareToken = isPublic ? ID.unique() : null;

  const data = {
    userId,
    title,
    description,
    mermaidCode,
    isPublic,
    shareToken,
  };

  // Set permissions based on public/private status
  const permissions = [
    Permission.read(Role.user(userId)),
    Permission.write(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];

  // If public, allow anyone to read
  if (isPublic) {
    permissions.push(Permission.read(Role.any()));
  }

  try {
    if (workspaceId) {
      return await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        workspaceId,
        data,
        permissions
      );
    } else {
      return await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_COLLECTION_ID,
        documentId,
        data,
        permissions
      );
    }
  } catch (error) {
    console.error("Error saving workspace:", error);
    throw error;
  }
};

/**
 * Get all workspaces for a user
 * @param {string} userId - The user ID
 * @returns {Promise<array>} Array of workspace documents
 */
export const getUserWorkspaces = async (userId) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("$updatedAt")]
    );
    return response.documents || [];
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    throw error;
  }
};

/**
 * Get a single workspace by ID
 * @param {string} workspaceId - The workspace document ID
 * @returns {Promise<object>} The workspace document
 */
export const getWorkspace = async (workspaceId) => {
  try {
    return await databases.getDocument(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      workspaceId
    );
  } catch (error) {
    console.error("Error fetching workspace:", error);
    throw error;
  }
};

/**
 * Get a public workspace by share token
 * @param {string} shareToken - The share token
 * @returns {Promise<object>} The workspace document
 */
export const getPublicWorkspace = async (shareToken) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      [
        Query.equal("shareToken", shareToken),
        Query.equal("isPublic", true),
      ]
    );

    if (response.documents && response.documents.length > 0) {
      return response.documents[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching public workspace:", error);
    throw error;
  }
};

/**
 * Delete a workspace
 * @param {string} workspaceId - The workspace document ID
 * @returns {Promise<void>}
 */
export const deleteWorkspace = async (workspaceId) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      workspaceId
    );
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  }
};

/**
 * Toggle workspace public/private status
 * @param {string} workspaceId - The workspace document ID
 * @param {boolean} isPublic - New public status
 * @param {string} userEmail - User email for notifications
 * @returns {Promise<object>} The updated workspace document
 */
export const toggleWorkspacePublic = async (workspaceId, isPublic, userEmail = null) => {
  try {
    const shareToken = isPublic ? ID.unique() : null;
    const result = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      workspaceId,
      {
        isPublic,
        shareToken,
      }
    );

    // Send notification if workspace was made public
    if (isPublic && userEmail) {
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/workspace/${shareToken}`;
      await sendWorkspaceNotification(userEmail, result.title, shareUrl);
    }

    return result;
  } catch (error) {
    console.error("Error toggling workspace public status:", error);
    throw error;
  }
};

/**
 * Duplicate a workspace
 * @param {string} userId - The user ID
 * @param {string} sourceWorkspaceId - The workspace to duplicate
 * @returns {Promise<object>} The duplicated workspace document
 */
export const duplicateWorkspace = async (userId, sourceWorkspaceId) => {
  try {
    const sourceWorkspace = await getWorkspace(sourceWorkspaceId);
    const newWorkspaceId = ID.unique();

    const newWorkspace = {
      userId,
      title: `${sourceWorkspace.title} (Copy)`,
      description: sourceWorkspace.description,
      mermaidCode: sourceWorkspace.mermaidCode,
      isPublic: false,
      shareToken: null,
    };

    return await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      newWorkspaceId,
      newWorkspace,
      [
        Permission.read(Role.user(userId)),
        Permission.write(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );
  } catch (error) {
    console.error("Error duplicating workspace:", error);
    throw error;
  }
};

/**
 * Export diagram to file format locally
 * Validates diagram before export using Mermaid
 * @param {string} mermaidCode - The Mermaid code to export
 * @param {string} format - Export format: 'svg' or 'pdf'
 * @returns {Promise<Blob>} The exported file as Blob
 */
export const exportDiagram = async (mermaidCode, format = 'svg') => {
  // Dynamic import to avoid SSR issues
  const { default: mermaid } = await import('mermaid');

  try {
    // Initialize Mermaid for client-side rendering
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    });

    // Validate and render diagram
    const { svg } = await mermaid.render('export-diagram', mermaidCode);

    // Return SVG as blob for both formats (client handles PDF conversion)
    return new Blob([svg], { type: 'image/svg+xml' });
  } catch (error) {
    console.error("Error exporting diagram:", error);
    throw new Error(`Diagram validation failed: ${error.message}`);
  }
};

/**
 * Send workspace shared notification via Messaging API
 * @param {string} userEmail - User email address
 * @param {string} workspaceTitle - Workspace title
 * @param {string} shareUrl - Share URL for the workspace
 * @returns {Promise<void>}
 */
const sendWorkspaceNotification = async (
  userEmail,
  workspaceTitle,
  shareUrl
) => {
  try {
    // Only send if email is valid
    if (!userEmail || !userEmail.includes('@')) {
      console.warn("Invalid email provided for notification");
      return;
    }

    const subject = `Your workspace "${workspaceTitle}" is now public!`;
    const html = `<strong>Your Mermaid diagram workspace "${workspaceTitle}" has been made public and can be shared with others.</strong><br><br>Share link: <a href="${shareUrl}">${shareUrl}</a><br><br>Visit your workspace to view and edit it.`;

    const executionBody = {
      to: [userEmail],
      subject,
      html
    };

    await functions.createExecution({
      functionId: EMAIL_PROCESSOR_FUNCTION_ID,
      body: JSON.stringify(executionBody),
      async: false,
      method: ExecutionMethod.POST,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(`Notification sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending workspace notification:", error);
    // Don't throw - notifications are non-critical
  }
};
