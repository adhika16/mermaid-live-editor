"use client";
import { useState, useEffect } from "react";

export default function SaveWorkspaceModal({ 
  isOpen, 
  onClose, 
  onSave, 
  isLoading = false,
  initialData = null,
  isEditMode = false
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with data when opening in edit mode
  useEffect(() => {
    if (isOpen && isEditMode && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setIsPublic(initialData.isPublic || false);
    } else if (isOpen) {
      // Reset for new workspace
      setTitle("");
      setDescription("");
      setIsPublic(false);
    }
  }, [isOpen, initialData, isEditMode]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Workspace title is required");
      return;
    }

    if (title.trim().length < 3) {
      setError("Workspace title must be at least 3 characters");
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        isPublic,
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setIsPublic(false);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to save workspace");
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setIsPublic(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <dialog className="modal modal-open z-50">
        <div className="modal-box w-full max-w-md">
          <h3 className="font-bold text-lg mb-4">
            {isEditMode ? "Update Workspace" : "Save Workspace"}
          </h3>

          {/* Title input */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Workspace Title *</span>
            </label>
            <input
              type="text"
              placeholder="Enter workspace name"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Description input */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Enter workspace description (optional)"
              className="textarea textarea-bordered w-full h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Public toggle */}
          <div className="form-control mb-4">
            <label className="label cursor-pointer">
              <span className="label-text">Make this workspace public (shareable)</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className={`btn btn-primary ${isLoading ? "loading" : ""}`}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading 
                ? (isEditMode ? "Updating..." : "Saving...") 
                : (isEditMode ? "Update Workspace" : "Save Workspace")
              }
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
