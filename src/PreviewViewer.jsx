//PreviewViewer.jsx

import React, { useState } from 'react';
import { Button } from '@mui/material';
import { FileUpload } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import QRCode from 'qrcode.react'


const PreviewViewer = ({modelUrl  } ) => {
  console.log("Model URL in PreviewViewer:", modelUrl); // Check if it's properly passed


  const [qrOpen, setQrOpen] = useState(false);

  const handleARView = () => {
    setQrOpen(true); // Open QR code dialog
    console.log(modelUrl)
  };

  const handleCloseQR = () => {
    setQrOpen(false); // Close QR code dialog
  };

  const arViewUrl = modelUrl ? `${window.location.origin}/ar-view?modelUrl=${encodeURIComponent(modelUrl)}` : "";



    const handleUploadClick = () => {
        // Handle your upload logic here
        console.log('Upload button clicked')
      }

  return (

    <div>
    <div className="preview-viewer-container">
<Button 
  className="movebutton"
  variant="contained"
  startIcon={<img src="/icons/arrows.svg" />}
  onClick={handleUploadClick}
></Button>

<Button 
  className="zoomout"
  variant="contained"
  startIcon={<img src="/icons/zoom-out.svg" />}
  onClick={handleUploadClick}
></Button>

<Button 
  className="zoomin"
  variant="contained"
  startIcon={<img src="/icons/zoom-in.svg" />}
  onClick={handleUploadClick}
></Button>

<Button 
  className="colorpicker"
  variant="contained"
  startIcon={<img src="/icons/color-wheel.png" />}
  onClick={handleUploadClick}
></Button>
</div>

<div className='Arviewbutton-container'>
<Button 
  className="ARbutton"
  variant="contained"
  startIcon={<img src="/icons/Aricon.svg" />}
  onClick={handleARView}
>

    See in your Space
</Button>
</div>
{/* QR Code Dialog */}
<Dialog open={qrOpen} onClose={handleCloseQR}>
        <DialogTitle>Scan QR Code for AR View</DialogTitle>
        <DialogContent>
          {modelUrl ? (
            <QRCode  value="https://google.com"
            size={256} // Reduced size for better scanning
            level="L"  // Low error correction level to reduce complexity
            fgColor="#000000" // Set color to black for better contrast
            bgColor="#ffffff" // Set background to white for clarity
            includeMargin={false} // Removed margin to avoid excessive space
             />
          ) : (
            <p>Model URL is not available</p>
          )}
          <p>Scan this QR code with your mobile device to view the model in AR.</p>
        </DialogContent>
      </Dialog>

      
    </div>
  )
}

export default PreviewViewer