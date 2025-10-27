"use client";
import Link from "next/link";
import { useState } from "react";

export default function WorkspaceCard({
  workspace,
  onDelete,
  onDuplicate,
  onShare,
  onOpen,
  isLoading = false,
}) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h2 className="card-title text-lg truncate">{workspace.title}</h2>
            {workspace.description && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {workspace.description}
              </p>
            )}
          </div>
          {workspace.isPublic && (
            <span className="badge badge-primary">Public</span>
          )}
        </div>

        {/* Metadata */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>Updated: {formatDate(workspace.$updatedAt)}</p>
          <p>Created: {formatDate(workspace.$createdAt)}</p>
        </div>

        {/* Preview of code */}
        <div className="bg-base-200 rounded p-2 my-2 max-h-20 overflow-hidden">
          <code className="text-xs text-gray-400 whitespace-pre-wrap break-words line-clamp-3">
            {workspace.mermaidCode.substring(0, 100)}...
          </code>
        </div>

        {/* Actions */}
        <div className="card-actions justify-between items-center mt-4">
          <button
            onClick={() => setShowActions(!showActions)}
            className="btn btn-xs btn-ghost"
          >
            {showActions ? "Hide" : "Actions"}
          </button>

          <button
            onClick={() => onOpen(workspace.$id)}
            className="btn btn-xs btn-primary"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        </div>

        {/* Expanded Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-base-300">
            <button
              onClick={() => onShare(workspace)}
              className="btn btn-xs btn-outline"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C9.589 12.804 10 11.8 10 10.5a3.5 3.5 0 11-7 0c0 1.295.411 2.297 1.316 2.837m4.368 5.005H9m6 0h.01M9 21h6a2 2 0 002-2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Share
            </button>

            <button
              onClick={() => onDuplicate(workspace.$id)}
              className="btn btn-xs btn-outline"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              Duplicate
            </button>

            <button
              onClick={() => onDelete(workspace.$id)}
              className="btn btn-xs btn-outline btn-error"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
