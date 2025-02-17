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
  const [modelFile, setModelFile] = useState(null); // Store the uploaded file

  // ✅ Generic function to upload a file to S3
  const uploadToS3 = async (file, key, contentType) => {
    try {
      await Storage.put(key, file, { contentType });
      return await Storage.get(key, { expires: 3600 });
    } catch (error) {
      console.error("Error uploading to S3:", error);
      alert("Failed to upload file. Please try again.");
      return null;
    }
  };

  // ✅ Function to generate a shareable link
  const handleShare = async () => {
    if (!modelFile) {
      alert("No model selected. Please import a model first.");
      return;
    }

    try {
      const fileKey = `models/${modelFile.name}`;
      const uploadedModelUrl = await uploadToS3(modelFile, fileKey, modelFile.type);
      if (!uploadedModelUrl) return;

      setModelUrl(uploadedModelUrl);

      const shareId = `share-${Date.now()}`;
      const shareData = {
        modelUrl: uploadedModelUrl,
        skybox: selectedSkybox,
        background: modelSettings.background,
        previewIcons: true,
      };

      const shareFileKey = `${shareId}.json`;
      const uploadedShareUrl = await uploadToS3(
        new Blob([JSON.stringify(shareData)], { type: "application/json" }),
        shareFileKey,
        "application/json"
      );
      if (!uploadedShareUrl) return;

      const shareUrl = `${window.location.origin}/share/${shareId}`;
      console.log("Shareable URL:", shareUrl);
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Shareable link copied to clipboard!");
      });
    } catch (error) {
      console.error("Error generating share link:", error);
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
          setModelFile={setModelFile}
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