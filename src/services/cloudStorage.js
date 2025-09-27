// Cloud Storage service with CDN support
// This is a hybrid approach that can work with both Firebase Storage and GCP

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase/config';

// Upload payment screenshot as base64 to avoid CSP issues
export const uploadPaymentScreenshot = async (file, bookingId) => {
  try {
    // Convert file to base64
    const base64Data = await fileToBase64(file);

    // Create metadata
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${bookingId}_${timestamp}.${fileExtension}`;

    // Return base64 data URL for immediate use
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    return {
      success: true,
      url: dataUrl,
      fileName: fileName,
      size: file.size,
      type: file.type,
      base64: base64Data,
      uploadedAt: new Date().toISOString(),
      isBase64: true
    };

  } catch (error) {
    console.error('Error processing payment screenshot:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix to get just the base64 string
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Convert Firebase Storage URL to CDN URL (if CDN is configured)
const convertToFirebaseCDN = (firebaseUrl) => {
  // If you have a CDN configured for Firebase Storage, replace the domain
  // Example: https://firebasestorage.googleapis.com -> https://your-cdn-domain.com

  // For now, return the Firebase URL as-is
  // You can replace this with your CDN domain when set up
  return firebaseUrl;

  // Example CDN conversion:
  // const cdnDomain = 'https://cdn.ekah-health.com';
  // return firebaseUrl.replace('https://firebasestorage.googleapis.com', cdnDomain);
};

// Upload public images with CDN optimization
export const uploadPublicImage = async (file, folder = 'public-images') => {
  try {
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${timestamp}_${file.name}`;

    const storageRef = ref(storage, fileName);

    const metadata = {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000', // 1 year cache
      customMetadata: {
        uploadType: 'public-image',
        uploadedAt: new Date().toISOString()
      }
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const cdnUrl = convertToFirebaseCDN(downloadURL);

    return {
      success: true,
      url: cdnUrl,
      originalUrl: downloadURL,
      fileName: fileName
    };

  } catch (error) {
    console.error('Error uploading public image:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Get optimized image URL with size parameters
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  const { width, height, quality = 85, format } = options;

  // If using Firebase Storage with CDN, you can add image transformation parameters
  // This is a placeholder - actual implementation depends on your CDN provider

  let optimizedUrl = originalUrl;
  const params = new URLSearchParams();

  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality) params.append('q', quality);
  if (format) params.append('f', format);

  if (params.toString()) {
    const separator = originalUrl.includes('?') ? '&' : '?';
    optimizedUrl = `${originalUrl}${separator}${params.toString()}`;
  }

  return optimizedUrl;
};

// Delete file from storage
export const deleteFile = async (fileName) => {
  try {
    const storageRef = ref(storage, fileName);
    await deleteObject(storageRef);
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

// Batch upload multiple files
export const batchUpload = async (files, folder = 'uploads') => {
  try {
    const uploadPromises = files.map(file => uploadPublicImage(file, folder));
    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      uploads: results,
      totalFiles: files.length,
      successfulUploads: results.filter(r => r.success).length
    };
  } catch (error) {
    console.error('Error in batch upload:', error);
    throw new Error(`Batch upload failed: ${error.message}`);
  }
};

// Setup Firebase Storage CORS (run once)
export const setupStorageCORS = () => {
  console.log(`
    To enable CDN and CORS for Firebase Storage, run these commands:

    1. Install Firebase CLI: npm install -g firebase-tools
    2. Login: firebase login
    3. Set project: firebase use ${process.env.REACT_APP_FIREBASE_PROJECT_ID || 'your-project-id'}
    4. Create cors.json file with:
    [
      {
        "origin": ["*"],
        "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
        "responseHeader": ["Content-Type", "Access-Control-Allow-Origin"],
        "maxAgeSeconds": 3600
      }
    ]
    5. Apply CORS: gsutil cors set cors.json gs://your-bucket-name.appspot.com
  `);
};

export default {
  uploadPaymentScreenshot,
  uploadPublicImage,
  getOptimizedImageUrl,
  deleteFile,
  batchUpload,
  setupStorageCORS
};