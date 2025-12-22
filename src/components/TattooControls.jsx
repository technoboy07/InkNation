/**
 * TattooControls Component
 * Control panel for tattoo manipulation (rotation, scale, etc.)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Upload, RotateCw, ZoomIn, X, Lock, Unlock } from 'lucide-react';
import { TATTOO_DEFAULTS } from '../constants';

/**
 * TattooControls component
 * @param {Object} tattooState - Current tattoo state
 * @param {Function} onFileUpload - Callback when file is uploaded
 * @param {boolean} rotationLocked - Whether rotation is locked
 * @param {boolean} zoomLocked - Whether zoom is locked
 * @param {Function} onRotationLockToggle - Callback to toggle rotation lock
 * @param {Function} onZoomLockToggle - Callback to toggle zoom lock
 */
const TattooControls = ({
  tattooState,
  onFileUpload,
  rotationLocked,
  zoomLocked,
  onRotationLockToggle,
  onZoomLockToggle,
}) => {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        minWidth: '300px',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Tattoo Controls</h3>

      {/* File Upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          aria-label="Upload tattoo image"
        />
        <button
          onClick={handleUploadClick}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          <Upload size={20} />
          Upload Tattoo
        </button>
      </div>

      {/* Remove Tattoo */}
      {tattooState.visible && (
        <button
          onClick={tattooState.removeTexture}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '16px',
          }}
        >
          <X size={20} />
          Remove Tattoo
        </button>
      )}

      {/* Rotation Control */}
      {tattooState.visible && (
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
            }}
          >
            <RotateCw size={16} />
            Rotation: {Math.round(tattooState.rotation)}°
          </label>
          <input
            type="range"
            min={TATTOO_DEFAULTS.MIN_ROTATION}
            max={TATTOO_DEFAULTS.MAX_ROTATION}
            value={tattooState.rotation}
            onChange={(e) => tattooState.updateRotation(Number(e.target.value))}
            style={{ width: '100%' }}
            aria-label="Tattoo rotation"
          />
        </div>
      )}

      {/* Scale Control */}
      {tattooState.visible && (
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
            }}
          >
            <ZoomIn size={16} />
            Scale: {tattooState.scale.toFixed(2)}x
          </label>
          <input
            type="range"
            min={TATTOO_DEFAULTS.MIN_SCALE}
            max={TATTOO_DEFAULTS.MAX_SCALE}
            step="0.1"
            value={tattooState.scale}
            onChange={(e) => tattooState.updateScale(Number(e.target.value))}
            style={{ width: '100%' }}
            aria-label="Tattoo scale"
          />
        </div>
      )}

      {/* Model Controls */}
      <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px' }}>
          Model Controls
        </h4>
        
        <button
          onClick={onRotationLockToggle}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '8px',
            backgroundColor: rotationLocked ? '#e74c3c' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
          }}
        >
          {rotationLocked ? <Lock size={16} /> : <Unlock size={16} />}
          {rotationLocked ? 'Unlock Rotation' : 'Lock Rotation'}
        </button>

        <button
          onClick={onZoomLockToggle}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: zoomLocked ? '#e74c3c' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
          }}
        >
          {zoomLocked ? <Lock size={16} /> : <Unlock size={16} />}
          {zoomLocked ? 'Unlock Zoom' : 'Lock Zoom'}
        </button>
      </div>
    </div>
  );
};

TattooControls.propTypes = {
  tattooState: PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number),
    rotation: PropTypes.number,
    scale: PropTypes.number,
    texture: PropTypes.string,
    visible: PropTypes.bool,
    updateRotation: PropTypes.func,
    updateScale: PropTypes.func,
    removeTexture: PropTypes.func,
  }).isRequired,
  onFileUpload: PropTypes.func.isRequired,
  rotationLocked: PropTypes.bool,
  zoomLocked: PropTypes.bool,
  onRotationLockToggle: PropTypes.func,
  onZoomLockToggle: PropTypes.func,
};

TattooControls.defaultProps = {
  rotationLocked: false,
  zoomLocked: false,
  onRotationLockToggle: () => {},
  onZoomLockToggle: () => {},
};

export default TattooControls;

