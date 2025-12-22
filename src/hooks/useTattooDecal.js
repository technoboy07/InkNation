/**
 * Custom hook for managing tattoo decal state
 */

import { useState, useCallback } from 'react';
import { TATTOO_DEFAULTS } from '../constants';

/**
 * Hook for managing tattoo decal properties
 * @returns {Object} Decal state and control functions
 */
export const useTattooDecal = () => {
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState(TATTOO_DEFAULTS.ROTATION);
  const [scale, setScale] = useState(TATTOO_DEFAULTS.SCALE);
  const [texture, setTexture] = useState(null);
  const [visible, setVisible] = useState(false);

  /**
   * Update decal position
   * @param {Array<number>} newPosition - New position [x, y, z]
   */
  const updatePosition = useCallback((newPosition) => {
    setPosition(newPosition);
  }, []);

  /**
   * Update decal rotation
   * @param {number} newRotation - New rotation in degrees
   */
  const updateRotation = useCallback((newRotation) => {
    const clampedRotation = Math.max(
      TATTOO_DEFAULTS.MIN_ROTATION,
      Math.min(TATTOO_DEFAULTS.MAX_ROTATION, newRotation)
    );
    setRotation(clampedRotation);
  }, []);

  /**
   * Update decal scale
   * @param {number} newScale - New scale value
   */
  const updateScale = useCallback((newScale) => {
    const clampedScale = Math.max(
      TATTOO_DEFAULTS.MIN_SCALE,
      Math.min(TATTOO_DEFAULTS.MAX_SCALE, newScale)
    );
    setScale(clampedScale);
  }, []);

  /**
   * Set texture from file
   * @param {string} textureUrl - URL of the texture
   */
  const setTextureFromUrl = useCallback((textureUrl) => {
    setTexture(textureUrl);
    setVisible(true);
  }, []);

  /**
   * Reset decal to defaults
   */
  const reset = useCallback(() => {
    setPosition([0, 0, 0]);
    setRotation(TATTOO_DEFAULTS.ROTATION);
    setScale(TATTOO_DEFAULTS.SCALE);
    setTexture(null);
    setVisible(false);
  }, []);

  /**
   * Remove texture
   */
  const removeTexture = useCallback(() => {
    setTexture(null);
    setVisible(false);
  }, []);

  return {
    position,
    rotation,
    scale,
    texture,
    visible,
    updatePosition,
    updateRotation,
    updateScale,
    setTextureFromUrl,
    reset,
    removeTexture,
  };
};

