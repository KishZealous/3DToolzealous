import React, { useState } from "react";
import Viewcanvas from "./viewcanvas";
import Hierarchy from "./hierarchy";
import Insceptor from "./Insceptor";
import ModelLoader from "./ModelLoader";

export default function App() {
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSkybox, setSelectedSkybox] = useState("studio");
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="main-layout">
      {/* Show Hierarchy when not in preview mode */}
      {!showPreview && (
        <div className="hierachystyle">
          <Hierarchy hierarchy={hierarchy} />
        </div>
      )}

      <div className="app-container">
        <ModelLoader
          setHierarchy={setHierarchy}
          setSelectedModel={setSelectedModel}
          selectedSkybox={selectedSkybox}
          setShowPreview={setShowPreview}
          showPreview={showPreview}
        />
        {showPreview && (
          <button
            className="exit-preview"
            onClick={() => setShowPreview(false)}
          >
            Exit Preview
          </button>
        )}
      </div>

      {/* Show Inspector when not in preview mode */}
      {!showPreview && (
        <div className="Inspectorstyle">
          <Insceptor
            selectedModel={selectedModel}
            onSkyboxChange={setSelectedSkybox}
            setShowPreview={setShowPreview}
          />
        </div>
      )}
    </div>
  );
}
