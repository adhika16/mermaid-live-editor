"use client";
import { useState, useEffect } from "react";
import { getPublicWorkspace } from "@/lib/appwrite-workspace";
import { useMermaid } from "@/lib/useMermaid";

export default function SharedWorkspacePage({ params }) {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const { mermaidSvg, errorMessage: mermaidError } = useMermaid(workspace?.mermaidCode, 100);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicWorkspace(params.shareToken);
        
        if (!data) {
          setError("Workspace not found or not public");
          return;
        }

        setWorkspace(data);
      } catch (err) {
        console.error("Error fetching workspace:", err);
        setError("Failed to load workspace");
      } finally {
        setLoading(false);
      }
    };

    if (params.shareToken) {
      fetchWorkspace();
    }
  }, [params.shareToken]);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  if (error || mermaidError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-lg text-gray-600">{error || mermaidError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      {mermaidSvg ? (
        <div 
          dangerouslySetInnerHTML={{ __html: mermaidSvg }}
          className="max-w-full max-h-full overflow-auto"
        />
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-lg text-gray-600">Loading diagram...</p>
        </div>
      )}
    </div>
  );
}
