import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

const PreviewViewer = ({ modelUrl }) => {
  console.log("🔗 Model URL received in PreviewViewer:", modelUrl);

  const [qrOpen, setQrOpen] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);

  // Generate a shortened URL for better QR scanning
  useEffect(() => {
    if (modelUrl) {
      const shortenUrl = async () => {
        try {
          const response = await fetch(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(modelUrl)}`
          );
          const shortened = await response.text();
          setShortUrl(shortened);
          console.log("✅ Shortened URL:", shortened);
        } catch (error) {
          console.error("❌ Short URL generation failed:", error);
          setShortUrl(modelUrl); // Fallback to original URL
        }
      };
      shortenUrl();
    }
  }, [modelUrl]);

  const handleARView = () => {
    setQrOpen(true);
  };

  const handleCloseQR = () => {
    setQrOpen(false);
  };

  const qrCodeValue = shortUrl || modelUrl; // Use shortened URL if available
  console.log("📱 QR Code Value:", qrCodeValue);

  return (
    <div>
    <div className="preview-viewer-container">
<Button 
  className="movebutton"
  variant="contained"
  startIcon={<img src="/icons/arrows.svg" />}
  
></Button>

<Button 
  className="zoomout"
  variant="contained"
  startIcon={<img src="/icons/zoom-out.svg" />}
 
></Button>

<Button 
  className="zoomin"
  variant="contained"
  startIcon={<img src="/icons/zoom-in.svg" />}
 
></Button>

<Button 
  className="colorpicker"
  variant="contained"
  startIcon={<img src="/icons/color-wheel.png" />}
 
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
          {qrCodeValue ? (
            <QRCodeCanvas value={qrCodeValue} size={256} />
          ) : (
            <p>Model URL is not available</p>
          )}
          <p>Scan this QR code with your mobile device to view the model in AR.</p>
        </DialogContent>
      </Dialog>

      
    </div>
  );
};

export default PreviewViewer;
