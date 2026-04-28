import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

/**
 * Uploads a file to Cloudinary
 * @param {string} localFilePath - Path to the local file
 * @returns {Promise<object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'content_broadcasting',
    });

    // Per requirements "Store file locally in /uploads", we do NOT unlink the file here.
    return response;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    // Even if Cloudinary fails, we keep the local file for fallback as per requirements.
    return null;
  }
};

export default uploadToCloudinary;
