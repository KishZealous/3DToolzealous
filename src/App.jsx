import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
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
  const [modelFile, setModelFile] = useState(null); // Store the uploaded file
  const [showGrid, setShowGrid] = useState(true); // ✅ Add Grid toggle state
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog
  const [folderName, setFolderName] = useState(""); // State to store the folder name

  // Function to open the dialog
  const handleShareClick = () => {
    if (!modelFile) {
      alert("No model loaded. Please upload a model first.");
      return;
    }
    setOpenDialog(true); // Open the dialog
  };

  // Function to close the dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setFolderName(""); // Reset folder name
  };

  // Function to handle folder name input
  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  // Function to generate a shareable link
  const handleShare = async () => {
    if (!folderName) {
      alert("Please enter a folder name.");
      return;
    }

    try {
      // Upload the model file to S3 inside the specified folder
      const modelKey = `${folderName}/model.glb`;
      await Storage.put(modelKey, modelFile, { contentType: modelFile.type });
      const modelUrl = await Storage.get(modelKey, { expires: 3600 });
      setModelUrl(modelUrl);

      // Create a unique ID for the shareable link
      const shareId = `share-${Date.now()}`;

      // Save the model and settings to S3 inside the specified folder
      const shareData = {
        modelUrl: modelUrl,
        skybox: selectedSkybox,
        background: modelSettings.background,
        previewIcons: true, // Indicate that preview icons should be shown
      };

      const shareKey = `${folderName}/share.json`;
      await Storage.put(shareKey, JSON.stringify(shareData), {
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
    } finally {
      handleDialogClose(); // Close the dialog
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
            <button className="share-button" onClick={handleShareClick}>
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

      {/* Dialog for folder name input */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Enter Folder Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            value={folderName}
            onChange={handleFolderNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleShare}>Share</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}