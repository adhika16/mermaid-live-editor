"use client";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { saveWorkspace } from "@/lib/appwrite-workspace";
import SaveWorkspaceModal from "@/components/SaveWorkspaceModal";
import MermaidEditor from "@/components/MermaidEditor";
import MermaidPreview from "@/components/MermaidPreview";

const EditorPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState(`graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;`);
  const [mermaidSvg, setMermaidSvg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  const handleMermaidRender = ({ svg, error }) => {
    setMermaidSvg(svg);
    setErrorMessage(error || "");
  };

  const handleSaveWorkspace = async (workspaceData) => {
    try {
      setIsSaving(true);
      setSaveSuccess("");

      const workspace = await saveWorkspace(user.$id, {
        ...workspaceData,
        mermaidCode: code,
      });

      setSaveSuccess("Workspace saved successfully!");
      setIsSaveModalOpen(false);

      // Clear success message after 3 seconds and navigate
      setTimeout(() => {
        setSaveSuccess("");
        router.push(`/editor/${workspace.$id}`);
      }, 3000);
    } catch (error) {
      console.error("Error saving workspace:", error);
      throw new Error(error.message || "Failed to save workspace");
    } finally {
      setIsSaving(false);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

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
        saveButtonText="Save"
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
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{saveSuccess}</span>
          </div>
        </div>
      )}

      {/* Save Workspace Modal */}
      <SaveWorkspaceModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveWorkspace}
        isLoading={isSaving}
      />
    </div>
  );
};

export default EditorPage;