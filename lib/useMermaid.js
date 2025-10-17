import { useState, useEffect } from "react";
import mermaid from "mermaid";

export const useMermaid = (code, delay = 300) => {
  const [mermaidSvg, setMermaidSvg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });

    const renderMermaid = async () => {
      try {
        setIsRendering(true);
        setMermaidSvg("");
        setErrorMessage("");

        const trimmedCode = code?.trim();
        if (!trimmedCode) {
          setErrorMessage("Please enter some Mermaid code");
          return;
        }

        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const parseResult = await mermaid.parse(trimmedCode);
        if (!parseResult) {
          setErrorMessage("Invalid Mermaid syntax");
          return;
        }

        const { svg } = await mermaid.render(uniqueId, trimmedCode);
        setMermaidSvg(svg);
        setErrorMessage("");
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        setMermaidSvg("");
        setErrorMessage(error.message || "Error rendering diagram");
      } finally {
        setIsRendering(false);
      }
    };

    const timeoutId = setTimeout(() => {
      renderMermaid();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [code, delay]);

  return { mermaidSvg, errorMessage, isRendering };
};