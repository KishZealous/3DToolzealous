import React from 'react'
import { Button } from '@mui/material'
import { FileUpload } from '@mui/icons-material'


const PreviewViewer = ({modelSettings } ) => {

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
  onClick={handleUploadClick}
>
 See in your Space
</Button>



</div>

    </div>
  )
}

export default PreviewViewer