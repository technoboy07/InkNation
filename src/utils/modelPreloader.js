/**
 * Model preloading utilities
 */

/**
 * Preload a GLTF/GLB model
 * @param {string} modelPath - Path to the model file
 * @returns {Promise} Promise that resolves when model is loaded
 */
export const preloadModel = async (modelPath) => {
  try {
    // In a real implementation, you might want to use a model loader
    // For now, this is a placeholder that can be extended
    const response = await fetch(modelPath);
    if (!response.ok) {
      throw new Error(`Failed to load model: ${response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error('Error preloading model:', error);
    throw error;
  }
};

/**
 * Preload multiple models
 * @param {string[]} modelPaths - Array of model paths
 * @returns {Promise} Promise that resolves when all models are loaded
 */
export const preloadModels = async (modelPaths) => {
  try {
    await Promise.all(modelPaths.map(preloadModel));
    return true;
  } catch (error) {
    console.error('Error preloading models:', error);
    throw error;
  }
};

