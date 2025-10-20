"use client";
import { useState, useEffect } from "react";
import mermaid from "mermaid";
import Editor from "@monaco-editor/react";
import { useSettings } from "@/lib/useSettings";

const MermaidEditor = ({ 
  code, 
  onCodeChange, 
  onMermaidRender,
  showTemplates = true,
  showSaveButton = false,
  onSave = null,
  isSaving = false,
  saveButtonText = "Save",
  headerContent = null
}) => {
  const [mermaidSvg, setMermaidSvg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { settings } = useSettings();

  // Mermaid templates
  const templates = {
    flowchart: {
      name: "Flowchart",
      code: `---
title: Node with text
---
flowchart LR
    id1[This is the text in the box]`
    },
    gantt: {
      name: "Gantt Chart",
      code: `gantt
    title A Gantt Diagram
    dateFormat YYYY-MM-DD
    section Section
        A task          :a1, 2014-01-01, 30d
        Another task    :after a1, 20d
    section Another
        Task in Another :2014-01-12, 12d
        another task    :24d`
    },
    sequence: {
      name: "Sequence Diagram",
      code: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!`
    },
    classDiagram: {
      name: "Class Diagram",
      code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    Animal <|-- Dog`
    },
    stateDiagram: {
      name: "State Diagram",
      code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`
    },
    pie: {
      name: "Pie Chart",
      code: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`
    },
    journey: {
      name: "User Journey",
      code: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`
    },
    mindmap: {
      name: "Mindmap",
      code: `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid`
    },
    timeline: {
      name: "Timeline",
      code: `timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter`
    }
  };

  const loadTemplate = (templateKey) => {
    if (templateKey && templates[templateKey] && onCodeChange) {
      onCodeChange(templates[templateKey].code);
    }
  };

  const handleManualRender = () => {
    // Trigger render by calling the same logic as the useEffect
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });

    const renderMermaid = async () => {
      try {
        setMermaidSvg("");
        setErrorMessage("");

        const trimmedCode = code.trim();
        if (!trimmedCode) {
          setErrorMessage("Please enter some Mermaid code");
          return;
        }

        const uniqueId = `mermaid-manual-${Date.now()}`;

        const parseResult = await mermaid.parse(trimmedCode);
        if (!parseResult) {
          setErrorMessage("Invalid Mermaid syntax");
          return;
        }

        const { svg } = await mermaid.render(uniqueId, trimmedCode);
        setMermaidSvg(svg);
        setErrorMessage("");

        if (onMermaidRender) {
          onMermaidRender({ svg, error: null });
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        setMermaidSvg("");
        const errorMsg = error.message || "Error rendering diagram";
        setErrorMessage(errorMsg);

        if (onMermaidRender) {
          onMermaidRender({ svg: "", error: errorMsg });
        }
      }
    };

    renderMermaid();
  };

  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme("daisyui-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6B7280", fontStyle: "italic" },
        { token: "keyword", foreground: "A78BFA" },
        { token: "string", foreground: "34D399" },
        { token: "number", foreground: "FBBF24" },
        { token: "operator", foreground: "F87171" },
        { token: "identifier", foreground: "E5E7EB" },
      ],
      colors: {
        "editor.background": "#1F2937",
        "editor.foreground": "#E5E7EB",
        "editor.lineHighlightBackground": "#374151",
        "editor.selectionBackground": "#4B5563",
        "editorCursor.foreground": "#60A5FA",
        "editorLineNumber.foreground": "#6B7280",
        "editorLineNumber.activeForeground": "#9CA3AF",
        "editor.selectionHighlightBackground": "#4B556350",
        "editor.wordHighlightBackground": "#4B556330",
        "editor.findMatchBackground": "#FBBF2450",
        "editor.findMatchHighlightBackground": "#FBBF2430",
      },
    });

    monaco.editor.setTheme("daisyui-dark");
  };

  // Render Mermaid when code changes
  useEffect(() => {
    // Skip rendering if auto-render is disabled
    if (!settings.autoRender) {
      return;
    }

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });

    const renderMermaid = async () => {
      try {
        setMermaidSvg("");
        setErrorMessage("");

        const trimmedCode = code.trim();
        if (!trimmedCode) {
          setErrorMessage("Please enter some Mermaid code");
          return;
        }

        const uniqueId = `mermaid-preview-${Date.now()}`;

        const parseResult = await mermaid.parse(trimmedCode);
        if (!parseResult) {
          setErrorMessage("Invalid Mermaid syntax");
          return;
        }

        const { svg } = await mermaid.render(uniqueId, trimmedCode);
        setMermaidSvg(svg);
        setErrorMessage("");

        // Notify parent component about the rendered SVG
        if (onMermaidRender) {
          onMermaidRender({ svg, error: null });
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        setMermaidSvg("");
        const errorMsg = error.message || "Error rendering diagram";
        setErrorMessage(errorMsg);

        if (onMermaidRender) {
          onMermaidRender({ svg: "", error: errorMsg });
        }
      }
    };

    const timeoutId = setTimeout(() => {
      renderMermaid();
    }, settings.renderDelay);

    return () => clearTimeout(timeoutId);
  }, [code, onMermaidRender, settings.autoRender, settings.renderDelay]);

  return (
    <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-base-200">
      {/* Header */}
      <div className="p-4 border-b border-base-300 flex gap-3 items-center justify-between border-r-base-content border-r">
        <div className="flex gap-3 items-center flex-1">
          {headerContent}
          
          {showTemplates && (
            <select
              className="select select-bordered select-sm"
              onChange={(e) => loadTemplate(e.target.value)}
              defaultValue=""
            >
              <option disabled value="">
                {headerContent ? "Templates" : "Select a template"}
              </option>
              {Object.entries(templates).map(([key, template]) => (
                <option key={key} value={key}>
                  {template.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex gap-2">
          {/* Manual render button when auto-render is disabled */}
          {!settings.autoRender && (
            <button
              onClick={handleManualRender}
              className="btn btn-sm btn-info"
              title="Manually render the diagram"
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Render
            </button>
          )}

          {showSaveButton && onSave && (
            <button
              onClick={onSave}
              className="btn btn-sm btn-success"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {saveButtonText}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="text"
          value={code}
          onChange={(value) => onCodeChange && onCodeChange(value || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily:
              'Monaco, "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace',
            lineNumbers: "on",
            rulers: [],
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            renderWhitespace: "selection",
            renderLineHighlight: "line",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: false,
          }}
        />
      </div>
    </div>
  );
};

export default MermaidEditor;