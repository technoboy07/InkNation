/**
 * Application constants
 */

// Routes
export const ROUTES = {
  HOME: '/',
  CREATE_NEW: '/create',
  YOUR_DESIGNS: '/designs',
  PROFILE: '/profile',
};

// File upload constraints
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg'],
  ALLOWED_EXTENSIONS: ['.png', '.jpg', '.jpeg'],
};

// Tattoo manipulation defaults
export const TATTOO_DEFAULTS = {
  SCALE: 1,
  ROTATION: 0,
  MIN_SCALE: 0.1,
  MAX_SCALE: 5,
  MIN_ROTATION: -180,
  MAX_ROTATION: 180,
};

// Model controls
export const MODEL_CONTROLS = {
  DEFAULT_ROTATION_LOCKED: false,
  DEFAULT_ZOOM_LOCKED: false,
};

// Error messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds 10MB limit',
  INVALID_FILE_TYPE: 'Please upload a PNG or JPEG image',
  FILE_READ_ERROR: 'Error reading file. Please try again.',
  MODEL_LOAD_ERROR: 'Failed to load 3D model. Please refresh the page.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'Tattoo image uploaded successfully',
  TATTOO_PLACED: 'Tattoo placed on model',
};

