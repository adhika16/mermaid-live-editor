"use client";
import { useAuth } from "@/lib/useAuth";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getWorkspace, saveWorkspace } from "@/lib/appwrite-workspace";
import SaveWorkspaceModal from "@/components/SaveWorkspaceModal";
import MermaidEditor from "@/components/MermaidEditor";
import MermaidPreview from "@/components/MermaidPreview";

const EditWorkspacePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId;

  const [code, setCode] = useState("");
  const [workspace, setWorkspace] = useState(null);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [workspaceLoadError, setWorkspaceLoadError] = useState("");
  const [mermaidSvg, setMermaidSvg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  const handleMermaidRender = ({ svg, error }) => {
    setMermaidSvg(svg);
    setErrorMessage(error || "");
  };

  // Load workspace on mount
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!workspaceId) {
      setWorkspaceLoadError("Invalid workspace ID");
      setIsLoadingWorkspace(false);
      return;
    }

    fetchWorkspace();
  }, [user, loading, router, workspaceId]);

  const fetchWorkspace = async () => {
    try {
      setIsLoadingWorkspace(true);
      setWorkspaceLoadError("");

      const data = await getWorkspace(workspaceId);

      if (!data) {
        setWorkspaceLoadError("Workspace not found");
        setIsLoadingWorkspace(false);
        return;
      }

      // Verify ownership
      if (data.userId !== user.$id) {
        setWorkspaceLoadError("You don't have permission to edit this workspace");
        setIsLoadingWorkspace(false);
        return;
      }

      setWorkspace(data);
      setCode(data.mermaidCode);
    } catch (error) {
      console.error("Error fetching workspace:", error);
      setWorkspaceLoadError("Failed to load workspace");
    } finally {
      setIsLoadingWorkspace(false);
    }
  };

  const handleSaveWorkspace = async (workspaceData) => {
    try {
      setIsSaving(true);
      setSaveSuccess("");

      await saveWorkspace(user.$id, {
        ...workspaceData,
        mermaidCode: code,
        workspaceId: workspaceId,
      });

      setSaveSuccess("Workspace updated successfully!");
      setIsSaveModalOpen(false);

      // Refresh workspace data
      setTimeout(() => {
        fetchWorkspace();
        setSaveSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error saving workspace:", error);
      throw new Error(error.message || "Failed to save workspace");
    } finally {
      setIsSaving(false);
    }
  };



  if (loading || isLoadingWorkspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  if (workspaceLoadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
        <div className="card bg-base-100 shadow-xl max-w-md">
          <div className="card-body text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-error mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="card-title justify-center text-lg">Error</h2>
            <p className="text-gray-500">{workspaceLoadError}</p>
            <div className="card-actions justify-center mt-4">
              <button
                onClick={() => router.push("/editor/dashboard")}
                className="btn btn-primary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const headerContent = (
    <div className="flex-1 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-line-icon lucide-pencil-line"><path d="M13 21h8"/><path d="m15 5 4 4"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
      <p className="font-semibold text-lg truncate">{workspace?.title}</p>
    </div>
  );

  // const additionalActions = (
  //   <button
  //     onClick={() => router.push("/editor/dashboard")}
  //     className="btn btn-sm btn-ghost"
  //   >
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       className="h-4 w-4"
  //       fill="none"
  //       viewBox="0 0 24 24"
  //       stroke="currentColor"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={2}
  //         d="M10 19l-7-7m0 0l7-7m-7 7h18"
  //       />
  //     </svg>
  //   </button>
  // );

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <MermaidEditor
        code={code}
        onCodeChange={setCode}
        onMermaidRender={handleMermaidRender}
        showTemplates={true}
        showSaveButton={true}
        onSave={() => setIsSaveModalOpen(true)}
        isSaving={isSaving}
        saveButtonText="Update"
        headerContent={
          <div className="flex items-center gap-2 flex-1">
            {headerContent}
            {/* {additionalActions} */}
          </div>
        }
      />
      
      <MermaidPreview
        mermaidSvg={mermaidSvg}
        errorMessage={errorMessage}
        showControls={true}
        showDownload={true}
        title="Preview"
      />

      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{saveSuccess}</span>
          </div>
        </div>
      )}

      {/* Save/Update Workspace Modal */}
      <SaveWorkspaceModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveWorkspace}
        isLoading={isSaving}
        initialData={workspace}
        isEditMode={true}
      />
    </div>
  );
};

export default EditWorkspacePage;
