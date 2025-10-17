import { Client, Databases, ID, Query, Permission, Role } from "appwrite";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const WORKSPACES_COLLECTION_ID = process.env.APPWRITE_WORKSPACES_COLLECTION_ID;

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
 * @returns {Promise<object>} The updated workspace document
 */
export const toggleWorkspacePublic = async (workspaceId, isPublic) => {
  try {
    const shareToken = isPublic ? ID.unique() : null;
    return await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_COLLECTION_ID,
      workspaceId,
      {
        isPublic,
        shareToken,
      }
    );
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
      [`read("user:${userId}")`, `write("user:${userId}")`]
    );
  } catch (error) {
    console.error("Error duplicating workspace:", error);
    throw error;
  }
};
