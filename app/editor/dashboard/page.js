"use client";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import WorkspaceCard from "@/components/WorkspaceCard";
import {
  getUserWorkspaces,
  deleteWorkspace,
  duplicateWorkspace,
} from "@/lib/appwrite-workspace";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublic, setFilterPublic] = useState(false);
  const [sortBy, setSortBy] = useState("updated"); // updated or created
  const [shareModal, setShareModal] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch workspaces
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchWorkspaces();
  }, [user, authLoading, router]);

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getUserWorkspaces(user.$id);
      setWorkspaces(data);
    } catch (err) {
      console.error("Error fetching workspaces:", err);
      setError("Failed to load workspaces. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (workspaceId) => {
    if (!confirm("Are you sure you want to delete this workspace?")) return;

    try {
      await deleteWorkspace(workspaceId);
      setWorkspaces(workspaces.filter((w) => w.$id !== workspaceId));
    } catch (err) {
      console.error("Error deleting workspace:", err);
      setError("Failed to delete workspace");
    }
  };

  const handleDuplicate = async (workspaceId) => {
    try {
      setIsLoading(true);
      const newWorkspace = await duplicateWorkspace(user.$id, workspaceId);
      setWorkspaces([newWorkspace, ...workspaces]);
    } catch (err) {
      console.error("Error duplicating workspace:", err);
      setError("Failed to duplicate workspace");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (workspace) => {
    setShareModal(workspace);
  };

  const copyShareLink = () => {
    if (shareModal?.shareToken) {
      const link = `${window.location.origin}/workspace/${shareModal.shareToken}`;
      navigator.clipboard.writeText(link);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleOpenWorkspace = (workspaceId) => {
    router.push(`/editor/${workspaceId}`);
  };

  // Filter and sort workspaces
  let filtered = workspaces;

  if (filterPublic) {
    filtered = filtered.filter((w) => w.isPublic);
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (w) =>
        w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  filtered.sort((a, b) => {
    const dateA = new Date(
      sortBy === "updated" ? a.$updatedAt : a.$createdAt
    );
    const dateB = new Date(
      sortBy === "updated" ? b.$updatedAt : b.$createdAt
    );
    return dateB - dateA;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold">My Workspaces</h1>
            <Link href="/editor" className="btn btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Workspace
            </Link>
          </div>
          <p className="text-gray-500">
            Total: {filtered.length} workspace{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError("")} className="btn btn-sm btn-ghost">
              Dismiss
            </button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-base-100 rounded-lg p-6 mb-6 shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Search</span>
              </label>
              <input
                type="text"
                placeholder="Search workspaces..."
                className="input input-bordered"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sort By</span>
              </label>
              <select
                className="select select-bordered"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updated">Recently Updated</option>
                <option value="created">Recently Created</option>
              </select>
            </div>

            {/* Filter */}
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Public Only</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={filterPublic}
                  onChange={(e) => setFilterPublic(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No workspaces found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterPublic
                ? "Try adjusting your filters or search term"
                : "Create your first workspace to get started"}
            </p>
            {!searchTerm && !filterPublic && (
              <Link href="/editor" className="btn btn-primary">
                Create New Workspace
              </Link>
            )}
          </div>
        )}

        {/* Workspaces Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((workspace) => (
              <WorkspaceCard
                key={workspace.$id}
                workspace={workspace}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onShare={handleShare}
                onOpen={handleOpenWorkspace}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShareModal(null)}
          />
          <dialog className="modal modal-open z-50">
            <div className="modal-box w-full max-w-md">
              <h3 className="font-bold text-lg mb-4">Share Workspace</h3>

              <div className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Share Link</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${typeof window !== "undefined" ? window.location.origin : ""}/workspace/${shareModal.shareToken}`}
                      className="input input-bordered flex-1"
                    />
                    <button
                      onClick={copyShareLink}
                      className={`btn btn-square ${
                        copySuccess ? "btn-success" : "btn-outline"
                      }`}
                    >
                      {copySuccess ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    ✅ This workspace is public and can be shared with anyone.
                    They can view it without signing in.
                  </p>
                </div>
              </div>

              <div className="modal-action mt-6">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShareModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}
