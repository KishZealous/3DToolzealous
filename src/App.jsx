//App.jsx

import React, { useState } from "react";
import Viewcanvas from "./viewcanvas";
import Hierarchy from "./hierarchy";
import Insceptor from "./Insceptor";
import ModelLoader from "./ModelLoader";
import WebPreview from './Webpreview';
import PreviewViewer from "./PreviewViewer";
import './amplifyConfig';



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


  const handleWebPreview = () => {
    // Store the settings in the localStorage or URL parameters
    const settings = {
      model: modelSettings.model, // Store the model data or URL (depending on your needs)
      background: modelSettings.background,
      skybox: modelSettings.skybox,
    };
    const settingsJson = encodeURIComponent(JSON.stringify(settings));

    // Open WebPreview in a new tab with encoded settings in the URL
    const previewWindow = window.open(`/webpreview?settings=${settingsJson}`, '_blank');
    previewWindow.focus();
    
  };



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
        />

        {/* Show PreviewViewer only when showPreview is true */}
        {showPreview && (
          <PreviewViewer  />
        )}


       

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


