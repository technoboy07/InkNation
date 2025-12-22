/**
 * HumanModel Component
 * Loads and displays a 3D human model
 */

import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import PropTypes from 'prop-types';

/**
 * Model component that loads a GLTF/GLB file
 * @param {string} modelPath - Path to the model file
 * @param {Object} props - Additional props to pass to the model
 */
const Model = ({ modelPath, ...props }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} {...props} />;
};

Model.propTypes = {
  modelPath: PropTypes.string.isRequired,
};

/**
 * HumanModel component with loading fallback
 * @param {string} modelPath - Path to the 3D model file
 * @param {Object} props - Additional props
 */
const HumanModel = ({ modelPath = '/models/Human2.glb', ...props }) => {
  return (
    <Suspense fallback={null}>
      <Model modelPath={modelPath} {...props} />
    </Suspense>
  );
};

HumanModel.propTypes = {
  modelPath: PropTypes.string,
};

export default HumanModel;

