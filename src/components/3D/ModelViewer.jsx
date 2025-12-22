/**
 * ModelViewer Component
 * Main 3D canvas wrapper with camera controls and lighting
 */

import React, { useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Raycaster, Vector3 } from 'three';
import PropTypes from 'prop-types';
import HumanModel from './HumanModel';
import TattooDecal from './TattooDecal';

/**
 * Click handler component that uses raycasting
 * Must be inside Canvas to access useThree hook
 */
const ClickHandler = ({ onModelClick, children }) => {
  const { camera, scene, gl } = useThree();
  const raycasterRef = useRef(new Raycaster());

  const handleClick = (event) => {
    if (!onModelClick) return;

    event.stopPropagation();

    // Calculate mouse position in normalized device coordinates
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new Vector3();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    raycasterRef.current.setFromCamera(mouse, camera);

    // Find intersections with all objects in scene
    const intersects = raycasterRef.current.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const intersection = intersects[0];
      onModelClick(intersection.point);
    }
  };

  return (
    <group onClick={handleClick}>
      {children}
    </group>
  );
};

ClickHandler.propTypes = {
  onModelClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

/**
 * ModelViewer component
 * @param {string} modelPath - Path to the 3D model
 * @param {Object} tattooState - Tattoo decal state
 * @param {Function} onModelClick - Callback when model is clicked
 * @param {boolean} rotationLocked - Whether model rotation is locked
 * @param {boolean} zoomLocked - Whether zoom is locked
 */
const ModelViewer = ({
  modelPath,
  tattooState,
  onModelClick,
  rotationLocked = false,
  zoomLocked = false,
}) => {
  const canvasRef = useRef();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: hovered ? 'pointer' : 'default',
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={(state) => {
          state.gl.setPixelRatio(window.devicePixelRatio);
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        <Environment preset="sunset" />

        <OrbitControls
          enableRotate={!rotationLocked}
          enableZoom={!zoomLocked}
          enablePan={true}
          minDistance={2}
          maxDistance={10}
        />

        <ClickHandler onModelClick={onModelClick}>
          <HumanModel
            modelPath={modelPath}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          />
        </ClickHandler>

        {tattooState.visible && tattooState.texture && (
          <TattooDecal
            position={tattooState.position}
            rotation={tattooState.rotation}
            scale={tattooState.scale}
            textureUrl={tattooState.texture}
            visible={tattooState.visible}
            onPositionChange={tattooState.updatePosition}
          />
        )}
      </Canvas>
    </div>
  );
};

ModelViewer.propTypes = {
  modelPath: PropTypes.string,
  tattooState: PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number),
    rotation: PropTypes.number,
    scale: PropTypes.number,
    texture: PropTypes.string,
    visible: PropTypes.bool,
    updatePosition: PropTypes.func,
  }).isRequired,
  onModelClick: PropTypes.func,
  rotationLocked: PropTypes.bool,
  zoomLocked: PropTypes.bool,
};

ModelViewer.defaultProps = {
  modelPath: '/models/Human2.glb',  // Update this
  onModelClick: null,
  rotationLocked: false,
  zoomLocked: false,
};

export default ModelViewer;

