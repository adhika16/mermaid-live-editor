"use client";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import mermaid from "mermaid";
import Editor from "@monaco-editor/react";

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

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: "default",
      securityLevel: "loose"
    });
    
    const renderMermaid = async () => {
      try {
        // Clear previous SVG and error
        setMermaidSvg("");
        setErrorMessage("");
        
        // Trim whitespace and check if code is not empty
        const trimmedCode = code.trim();
        if (!trimmedCode) {
          setErrorMessage("Please enter some Mermaid code");
          return;
        }
        
        // Generate a unique ID for each render using timestamp
        const uniqueId = `mermaid-preview-${Date.now()}`;
        
        // Parse first to validate syntax
        const parseResult = await mermaid.parse(trimmedCode);
        if (!parseResult) {
          setErrorMessage("Invalid Mermaid syntax");
          return;
        }
        
        // Render the diagram
        const { svg } = await mermaid.render(uniqueId, trimmedCode);
        setMermaidSvg(svg);
        setErrorMessage("");
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        setMermaidSvg("");
        setErrorMessage(error.message || "Error rendering diagram");
      }
    };

    // Add debounce to prevent too frequent renders
    const timeoutId = setTimeout(() => {
      renderMermaid();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [code]);

  const handleEditorDidMount = (editor, monaco) => {
    // Define a custom theme that matches DaisyUI
    monaco.editor.defineTheme('daisyui-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'A78BFA' },
        { token: 'string', foreground: '34D399' },
        { token: 'number', foreground: 'FBBF24' },
        { token: 'operator', foreground: 'F87171' },
        { token: 'identifier', foreground: 'E5E7EB' },
      ],
      colors: {
        'editor.background': '#1F2937',
        'editor.foreground': '#E5E7EB',
        'editor.lineHighlightBackground': '#374151',
        'editor.selectionBackground': '#4B5563',
        'editorCursor.foreground': '#60A5FA',
        'editorLineNumber.foreground': '#6B7280',
        'editorLineNumber.activeForeground': '#9CA3AF',
        'editor.selectionHighlightBackground': '#4B556350',
        'editor.wordHighlightBackground': '#4B556330',
        'editor.findMatchBackground': '#FBBF2450',
        'editor.findMatchHighlightBackground': '#FBBF2430',
      }
    });

    // Set the custom theme
    monaco.editor.setTheme('daisyui-dark');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <Editor
          height="100%"
          defaultLanguage="text"
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'Monaco, "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace',
            lineNumbers: 'on',
            rulers: [],
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: 'selection',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: false,
          }}
        />
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center bg-base-200 p-4">
        {errorMessage ? (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{errorMessage}</span>
          </div>
        ) : mermaidSvg ? (
          <div 
            dangerouslySetInnerHTML={{ __html: mermaidSvg }} 
            className="max-w-full max-h-full overflow-auto"
          />
        ) : (
          <div className="text-gray-500 text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>Your diagram will appear here</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;