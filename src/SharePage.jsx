import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Storage } from '@aws-amplify/storage';
import { Canvas, useThree } from "@react-three/fiber"; // Import useThree
import { OrbitControls, Environment, Center } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";

const SharePage = () => {
  const { shareId } = useParams();
  const [modelUrl, setModelUrl] = useState(null);
  const [skybox, setSkybox] = useState("studio");
  const [background, setBackground] = useState("#ffffff");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShareData = async () => {
      try {
        // Fetch the share data from S3
        const shareData = await Storage.get(`${shareId}.json`, {
          download: true,
        });
        const data = JSON.parse(await shareData.Body.text());

        // Set the model and settings
        setModelUrl(data.modelUrl);
        setSkybox(data.skybox);
        setBackground(data.background);
        setLoading(false);
      } catch (error) {
        console.error("Error loading share data:", error);
        setLoading(false);
      }
    };

    loadShareData();
  }, [shareId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh", background }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }}
       dpr={[1, 2]}
       className="AppBg"
      >
        <ambientLight intensity={0.2} />
        {/* <pointLight position={[10, 10, 10]} intensity={0.5} /> */}
        <OrbitControls />
        
        <Environment preset={skybox} background={false} />
        <Center>
          <ModelViewer modelUrl={modelUrl} />
        </Center>
      </Canvas>
      <div className="preview-viewer-container">
    <Button 
  className="movebutton"
  variant="contained"
  startIcon={<img src="/icons/arrows.svg" />}
  
>   </Button>

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
 
>

    See in your Space
</Button>
</div>

    </div>
  );
};

// ModelViewer component to load and display the 3D model
const ModelViewer = ({ modelUrl }) => {
  const { scene } = useThree(); // Use the useThree hook
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (modelUrl) {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        scene.add(gltf.scene);
        setModel(gltf);
      });
    }
  }, [modelUrl, scene]);

  return null;
};

export default SharePage;