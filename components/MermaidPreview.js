"use client";
import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const MermaidPreview = ({ 
  mermaidSvg, 
  errorMessage, 
  showControls = true,
  showDownload = true,
  title = "Preview" 
}) => {
  const [transformControls, setTransformControls] = useState(null);

  const downloadSvg = () => {
    if (!mermaidSvg) return;

    const blob = new Blob([mermaidSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `mermaid-diagram-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}.svg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-base-200">
      {/* Header with controls */}
      {(showControls || showDownload) && (
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center gap-2">
            {mermaidSvg && transformControls && showControls && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => transformControls.zoomOut()}
                  className="btn btn-xs btn-ghost"
                  title="Zoom Out"
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
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => transformControls.resetTransform()}
                  className="btn btn-xs btn-ghost"
                  title="Reset Zoom"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => transformControls.zoomIn()}
                  className="btn btn-xs btn-ghost"
                  title="Zoom In"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>
            )}
            {showDownload && (
              <button
                onClick={downloadSvg}
                disabled={!mermaidSvg}
                className="btn btn-sm btn-primary"
                title="Download SVG"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download SVG
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preview content */}
      <div className="flex-1 overflow-hidden">
        {errorMessage ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="alert alert-error">
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
              <span className="text-sm">{errorMessage}</span>
            </div>
          </div>
        ) : mermaidSvg ? (
          <TransformWrapper
            initialScale={1}
            minScale={0.1}
            maxScale={3}
            wheel={{ step: 0.1 }}
            panning={{ disabled: false }}
            doubleClick={{ disabled: false }}
            limitToBounds={false}
            centerOnInit={true}
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{ width: "100%", height: "100%" }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => {
              if (!transformControls) {
                setTransformControls({ zoomIn, zoomOut, resetTransform });
              }

              return (
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: mermaidSvg }}
                    className="select-none"
                  />
                </TransformComponent>
              );
            }}
          </TransformWrapper>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-4xl mb-2">📊</div>
              <div>Your diagram will appear here</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MermaidPreview;