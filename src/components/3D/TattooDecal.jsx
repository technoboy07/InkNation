/**
 * TattooDecal Component
 * Interactive decal component for placing tattoos on 3D model
 */

import React, { useRef, useMemo } from 'react';
import { Decal, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import PropTypes from 'prop-types';

/**
 * TattooDecal component
 * @param {Array<number>} position - Decal position [x, y, z]
 * @param {number} rotation - Decal rotation in degrees
 * @param {number} scale - Decal scale
 * @param {string} textureUrl - URL of the tattoo texture
 * @param {boolean} visible - Whether decal is visible
 * @param {Function} onPositionChange - Callback when position changes
 */
const TattooDecal = ({
  position,
  rotation,
  scale,
  textureUrl,
  visible,
  onPositionChange,
}) => {
  const decalRef = useRef();
  
  // Create a transparent 1x1 pixel data URL as placeholder
  const placeholderTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  
  // Always call useTexture hook (Rules of Hooks requirement)
  // Use placeholder if no textureUrl is provided
  const texture = useTexture(textureUrl || placeholderTexture);

  // Convert rotation from degrees to radians
  const rotationRad = useMemo(() => (rotation * Math.PI) / 180, [rotation]);

  // Drag handler for moving decal
  const bind = useDrag(
    ({ offset: [x, y], first, last }) => {
      if (first) {
        // Store initial position on drag start
        decalRef.current.userData.startPosition = [...position];
      }

      if (decalRef.current && onPositionChange) {
        // Calculate new position based on drag offset
        // This is a simplified 2D drag - in a full implementation,
        // you'd use raycasting to project onto the 3D surface
        const sensitivity = 0.01;
        const newPosition = [
          decalRef.current.userData.startPosition[0] + x * sensitivity,
          decalRef.current.userData.startPosition[1] + y * sensitivity,
          decalRef.current.userData.startPosition[2],
        ];
        onPositionChange(newPosition);
      }
    },
    { enabled: visible && !!textureUrl }
  );

  useFrame(() => {
    if (decalRef.current) {
      decalRef.current.position.set(...position);
    }
  });

  // Only render if visible and has a valid texture URL
  if (!visible || !textureUrl) {
    return null;
  }

  return (
    <mesh ref={decalRef} position={position} {...bind()}>
      <Decal
        position={[0, 0, 0]}
        rotation={[0, 0, rotationRad]}
        scale={scale}
        map={texture}
        polygonOffset
        polygonOffsetFactor={-4}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

TattooDecal.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  rotation: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  textureUrl: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onPositionChange: PropTypes.func,
};

TattooDecal.defaultProps = {
  textureUrl: null,
  onPositionChange: null,
};

export default TattooDecal;