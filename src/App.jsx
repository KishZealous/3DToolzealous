//App.jsx

import React, { useState } from "react";
import Viewcanvas from "./viewcanvas";
import Hierarchy from "./hierarchy";
import Insceptor from "./Insceptor";
import ModelLoader from "./ModelLoader";
import PreviewViewer from "./PreviewViewer";


export default function App() {
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSkybox, setSelectedSkybox] = useState("studio");
  const [showPreview, setShowPreview] = useState(false);
  const [modelSettings, setModelSettings] = useState({
    model: null,
    background: '#ffffff',  // default background color
    skybox: 'studio',

  });
  const [modelUrl, setModelUrl] = useState(null);  // Store uploaded model URL





  return (
    <div className={`main-layout ${showPreview ? "preview-mode" : ""}`}>
      {!showPreview && (
        <div className="hierachystyle">
          <Hierarchy hierarchy={hierarchy} />
        </div>
      )}

      <div className={`app-container ${showPreview ? "preview-mode" : ""}`}>
        <ModelLoader
          setHierarchy={setHierarchy}
          setSelectedModel={setSelectedModel}
          selectedSkybox={selectedSkybox}
          setShowPreview={setShowPreview}
          showPreview={showPreview}
          setModelUrl={setModelUrl}
        />

        {/* Show PreviewViewer only when showPreview is true */}
        {showPreview && (
          <PreviewViewer modelUrl={modelUrl} />
          
          
        
        )
        
        
        }


       

        {/* Exit button in top-right when in preview mode */}
        {showPreview && (
          <div className="preview-buttons">
          <button className="exit-preview" onClick={() => setShowPreview(false)}>
            Exit Preview
          </button>

         
        </div>
      )}

      </div>

      {!showPreview && (
        <div className="Inspectorstyle">
          <Insceptor
            selectedModel={selectedModel}
            onSkyboxChange={setSelectedSkybox}
            setShowPreview={setShowPreview}
          />
          <div>
         

          </div>

        </div>
      )}
    </div>
  );
}


