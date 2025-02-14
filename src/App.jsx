import React, { useState } from "react";
import Viewcanvas from "./viewcanvas";
import Hierarchy from "./hierarchy";
import Insceptor from "./Insceptor";
import ModelLoader from "./ModelLoader";
import WebPreview from './Webpreview';
import PreviewViewer from "./PreviewViewer";
import { Storage } from '@aws-amplify/storage';


export default function App() {
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSkybox, setSelectedSkybox] = useState("city");
  const [showPreview, setShowPreview] = useState(false);
  const [modelSettings, setModelSettings] = useState({
    model: null,
    background: '#ffffff',  // default background color
    skybox: 'city',
  });
  const [modelUrl, setModelUrl] = useState(null);  // Store uploaded model URL
  const [showGrid, setShowGrid] = useState(true); // ✅ Add Grid toggle state

  // Function to generate a shareable link
  const handleShare = async () => {
    if (!modelUrl) {
      alert("No model loaded. Please upload a model first.");
      return;
    }

    // Generate unique file names
  const timestamp = Date.now();
  const modelFileName = `models/model-${timestamp}.glb`;
  const jsonFileName = `models/model-${timestamp}.json`;

  try {
    // Upload model to S3
    await Storage.put(modelFileName, modelUrl, {
      contentType: "model/gltf-binary",
    });
    const uploadedModelUrl = await Storage.get(modelFileName, { expires: 3600 });

    // // Create a unique ID for the shareable link
    // const shareId = `share-${Date.now()}`;

    // Update modelUrl state to point to S3 URL
    setModelUrl(uploadedModelUrl); 

    // Save the model and settings to S3
    const shareData = {
      modelUrl,
      skybox: selectedSkybox,
      background: modelSettings.background,
      previewIcons: true, // Indicate that preview icons should be shown
    };

    // Upload JSON metadata
    await Storage.put(jsonFileName, JSON.stringify(shareData), {
      contentType: "application/json",
    });


      // Generate the shareable link
      const shareUrl = `${window.location.origin}/share/${shareId}`;
      console.log("Shareable URL:", shareUrl);

      // Copy the link to the clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Shareable link copied to clipboard!");
      });
    } catch (error) {
      console.error("Error generating shareable link:", error);
      alert("Failed to generate shareable link. Please try again.");
    }
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
          setModelUrl={setModelUrl}
          showGrid={showGrid}
        />

        {/* Show PreviewViewer only when showPreview is true */}
        {showPreview && (
          <PreviewViewer modelUrl={modelUrl} />
        )}

        {/* Exit and Share buttons in top-right when in preview mode */}
        {showPreview && (
          <div className="preview-buttons">
            <button className="exit-preview" onClick={() => setShowPreview(false)}>
              Exit Preview
            </button>
            <button className="share-button" onClick={handleShare}>
              Share
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
            setModelSettings={setModelSettings}
            setShowGrid={setShowGrid} // ✅ Pass Grid toggle function
            showGrid={showGrid} // ✅ Pass Grid state
          />
        </div>
      )}
    </div>
  );
}