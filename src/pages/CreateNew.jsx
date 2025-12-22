/**
 * CreateNew Page
 * Main page for creating and previewing tattoos on 3D model
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTattooDecal } from '../hooks/useTattooDecal';
import { ModelViewer } from '../components/3D';
import TattooControls from '../components/TattooControls';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateFile, getErrorMessage, logError } from '../utils/errorHandler';
import { SUCCESS_MESSAGES } from '../constants';

/**
 * CreateNew page component
 */
const CreateNew = () => {
  const tattooState = useTattooDecal();
  const [rotationLocked, setRotationLocked] = useState(false);
  const [zoomLocked, setZoomLocked] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const textureUrlRef = useRef(null);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (textureUrlRef.current) {
        URL.revokeObjectURL(textureUrlRef.current);
      }
    };
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (file) => {
      setError(null);
      setSuccess(null);

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      setIsLoading(true);

      try {
        // Cleanup previous texture URL if exists
        if (textureUrlRef.current) {
          URL.revokeObjectURL(textureUrlRef.current);
        }

        // Create object URL for the texture
        const textureUrl = URL.createObjectURL(file);
        textureUrlRef.current = textureUrl;
        tattooState.setTextureFromUrl(textureUrl);
        setSuccess(SUCCESS_MESSAGES.FILE_UPLOADED);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        logError(err, 'CreateNew.handleFileUpload');
      } finally {
        setIsLoading(false);
      }
    },
    [tattooState]
  );

  // Handle model click for placing tattoo
  const handleModelClick = useCallback(
    (position) => {
      if (tattooState.texture) {
        tattooState.updatePosition([position.x, position.y, position.z]);
        setSuccess(SUCCESS_MESSAGES.TATTOO_PLACED);
      }
    },
    [tattooState]
  );

  // Toggle rotation lock
  const handleRotationLockToggle = useCallback(() => {
    setRotationLocked((prev) => !prev);
  }, []);

  // Toggle zoom lock
  const handleZoomLockToggle = useCallback(() => {
    setZoomLocked((prev) => !prev);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 60px)',
        padding: '20px',
        gap: '20px',
      }}
    >
      {/* Error/Success Messages */}
      {error && (
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '5px',
            border: '1px solid #fcc',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#efe',
            color: '#3c3',
            borderRadius: '5px',
            border: '1px solid #cfc',
          }}
        >
          {success}
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          gap: '20px',
          minHeight: 0,
        }}
      >
        {/* 3D Viewer */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {isLoading ? (
            <LoadingSpinner message="Loading tattoo..." />
          ) : (
            <ModelViewer
              modelPath="/models/Human2.glb"
              tattooState={tattooState}
              onModelClick={handleModelClick}
              rotationLocked={rotationLocked}
              zoomLocked={zoomLocked}
            />
          )}
        </div>

        {/* Controls Panel */}
        <div style={{ flexShrink: 0 }}>
          <TattooControls
            tattooState={tattooState}
            onFileUpload={handleFileUpload}
            rotationLocked={rotationLocked}
            zoomLocked={zoomLocked}
            onRotationLockToggle={handleRotationLockToggle}
            onZoomLockToggle={handleZoomLockToggle}
          />
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        <strong>Instructions:</strong> Upload a tattoo image, then click on the
        3D model to place it. Use the controls to adjust rotation and scale.
        Drag the tattoo to move it on the model surface.
      </div>
    </div>
  );
};

export default CreateNew;

