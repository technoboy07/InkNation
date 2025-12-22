/**
 * Error handling utilities
 */

import { ERROR_MESSAGES, FILE_CONSTRAINTS } from '../constants';

/**
 * Get user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error?.message) {
    // Check for specific error types
    if (error.message.includes('size') || error.message.includes('large')) {
      return ERROR_MESSAGES.FILE_TOO_LARGE;
    }
    if (error.message.includes('type') || error.message.includes('format')) {
      return ERROR_MESSAGES.INVALID_FILE_TYPE;
    }
    if (error.message.includes('read')) {
      return ERROR_MESSAGES.FILE_READ_ERROR;
    }
    if (error.message.includes('model') || error.message.includes('GLTF')) {
      return ERROR_MESSAGES.MODEL_LOAD_ERROR;
    }
    return error.message;
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR;
};

/**
 * Log error for debugging
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
  // In production, you might want to send to error tracking service
  // if (config.enableErrorTracking) {
  //   errorTrackingService.log(error, context);
  // }
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {{valid: boolean, error?: string}} Validation result
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  const isValidType = FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type);
  if (!isValidType) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
  }

  // Check file size
  if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
    return { valid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  return { valid: true };
};

