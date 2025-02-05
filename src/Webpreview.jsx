import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { OrbitControls, Environment, Center } from '@react-three/drei';

const WebPreview = () => {
  const [settings, setSettings] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const settingsJson = urlParams.get('settings');
    if (settingsJson) {
      const parsedSettings = JSON.parse(decodeURIComponent(settingsJson));
      setSettings(parsedSettings);

      // Load model based on the provided settings
      const loader = new GLTFLoader();
      loader.load(parsedSettings.model, (gltf) => {
        setModel(gltf);
      });
    }
  }, []);

  if (!settings || !model) return <div>Loading...</div>;

  return (
    <div className="web-preview-container">
      <Canvas>
        <ambientLight intensity={0.2} />
        <OrbitControls />
        <Environment preset={settings.skybox || 'studio'} background={false} />
        <Center>
          <primitive object={model.scene} />
        </Center>
      </Canvas>
    </div>
  );
};

export default WebPreview;
