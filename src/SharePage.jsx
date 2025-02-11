import React, { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import { Storage } from '@aws-amplify/storage';
import { Canvas, useThree } from "@react-three/fiber"; // Import useThree
import { OrbitControls, Environment, Center } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Button, Dialog, DialogTitle, DialogContent } from "@mui/material";
import * as THREE from 'three';
import Controls from "./Controls";

const SharePage = () => {
  const { shareId } = useParams();
  const [modelUrl, setModelUrl] = useState(null);
  const [skybox, setSkybox] = useState("studio");
  const [background, setBackground] = useState("#ffffff");
  const [loading, setLoading] = useState(true);
  const controlsRef = useRef();
  const [modelLoading, setModelLoading] = useState(false); // ✅ Track model loading state
  const [enablePan, setEnablePan] = useState(true);
  const [zoomDirection, setZoomDirection] = useState(0); // 1 for zoom in, -1 for zoom out


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

  // Apply zoom when zoomDirection changes
  useEffect(() => {
    if (controlsRef.current) {
      if (zoomDirection !== 0) {
        const zoomFactor = zoomDirection > 0 ? 0.9 : 1.1; // Zoom In (0.9) / Out (1.1)
        controlsRef.current.object.position.multiplyScalar(zoomFactor);
        setZoomDirection(0); // Reset zoom direction after applying
      }
    }
  }, [zoomDirection]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {modelLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading Model...</p>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 3], fov: 40 }}
       dpr={[1, 2]}
       className="AppBg"
       style={{ background: background }} // ✅ Apply background color from share data
      >
        <ambientLight intensity={0.2} />
        {/* <pointLight position={[10, 10, 10]} intensity={0.5} /> */}
        <OrbitControls ref={controlsRef} />
        
        <Environment preset={skybox} background={false} />
        <Center>
          <ModelViewer modelUrl={modelUrl}  setModelLoading={setModelLoading}/>
        </Center>
      </Canvas>
      <div className="preview-viewer-container">
    <Button 
  className="movebutton"
  variant="contained"
  startIcon={<img src="/icons/arrows.svg" />}
  onClick={() => setEnablePan(prev => !prev)} // ✅ Toggle pan
     >
      {enablePan }
  </Button>

<Button 
  className="zoomout"
  variant="contained"
  startIcon={<img src="/icons/zoom-out.svg" />}
  onClick={() => setZoomDirection(-1)} // ✅ Zoom Out
        >
 
</Button>

<Button 
  className="zoomin"
  variant="contained"
  startIcon={<img src="/icons/zoom-in.svg" />}
  onClick={() => setZoomDirection(1)} // ✅ Zoom In
 
></Button>

<Button 
  className="colorpicker"
  variant="contained"
  startIcon={<img src="/icons/color-wheel.png" />}
 
></Button>
</div>

{/* AR View Button */}
<div className="Arviewbutton-container">
        <Button
          className="ARbutton"
          variant="contained"
          startIcon={<img src="/icons/Aricon.svg" />}
          onClick={() => document.getElementById("arViewer").click()} // ✅ Open AR view
        >
          See in Your Space
        </Button>
      </div>

      {/* Hidden Model Viewer for AR */}
      {modelUrl && (
        <model-viewer
          id="arViewer"
          src={modelUrl}
          alt="3D Model"
          ar
          ar-modes="scene-viewer webxr quick-look"
          camera-controls
          style={{ display: "none" }} // Hide, but allow clicking through button
        ></model-viewer>
      )}
    </div>
  );
};

// ModelViewer component to load and display the 3D model
const ModelViewer = ({ modelUrl,setModelLoading }) => {
  const { scene, camera, controls } = useThree();
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (modelUrl) {
      if (setModelLoading) setModelLoading(true); // ✅ Check before calling

      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        const modelScene = gltf.scene;
        

        // Compute bounding box to center the model
        const box = new THREE.Box3().setFromObject(modelScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        modelScene.position.sub(center); // Center the model

        // Adjust camera to fit the model
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

        camera.position.set(center.x, center.y, cameraZ + maxDim);
        camera.lookAt(center);

        if (controls) {
          controls.target.set(center.x, center.y, center.z);
          controls.update();
        }

        scene.add(modelScene);
        setModel(gltf);
        if (setModelLoading) setModelLoading(false); // ✅ Stop loading
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
        if (setModelLoading) setModelLoading(false); // ✅ Stop loading
      });
    }
  }, [modelUrl, scene, camera, controls,setModelLoading]);

  return null;
};

export default SharePage;