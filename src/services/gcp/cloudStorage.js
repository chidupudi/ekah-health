// Google Cloud Storage service with CDN
import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
// You'll need to set up these environment variables:
// GOOGLE_CLOUD_PROJECT_ID
// GOOGLE_CLOUD_STORAGE_BUCKET
// GOOGLE_CLOUD_KEY_FILE (path to service account JSON)

const projectId = process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID || 'ekah-health';
const bucketName = process.env.REACT_APP_GOOGLE_CLOUD_STORAGE_BUCKET || 'ekah-health-images';

// Initialize storage client
const storage = new Storage({
  projectId: projectId,
  keyFilename: process.env.REACT_APP_GOOGLE_CLOUD_KEY_FILE, // Path to service account JSON
});

const bucket = storage.bucket(bucketName);

// Upload file to Google Cloud Storage with CDN
export const uploadToGCS = async (file, folder = 'uploads') => {
  try {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const fileUpload = bucket.file(fileName);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload options
    const options = {
      metadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // 1 year cache
      },
      public: true, // Make file publicly accessible
    };

    // Upload file
    await fileUpload.save(buffer, options);

    // Make file public (if not already)
    await fileUpload.makePublic();

    // Return CDN URL
    const cdnUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return {
      success: true,
      url: cdnUrl,
      fileName: fileName,
      bucket: bucketName
    };
  } catch (error) {
    console.error('Error uploading to GCS:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

// Upload payment screenshot specifically
export const uploadPaymentScreenshot = async (file, bookingId) => {
  try {
    const folder = 'payment-screenshots';
    const fileName = `${folder}/${bookingId}_${Date.now()}_payment.${file.name.split('.').pop()}`;

    const fileUpload = bucket.file(fileName);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload with specific metadata for payment screenshots
    const options = {
      metadata: {
        contentType: file.type,
        cacheControl: 'private, max-age=3600', // 1 hour cache for payment screenshots
        customMetadata: {
          bookingId: bookingId,
          uploadType: 'payment-screenshot',
          uploadedAt: new Date().toISOString()
        }
      },
      public: false, // Payment screenshots should be private
    };

    await fileUpload.save(buffer, options);

    // Generate signed URL for secure access (valid for 1 hour)
    const [signedUrl] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return {
      success: true,
      url: signedUrl,
      fileName: fileName,
      bucket: bucketName,
      isPrivate: true,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error uploading payment screenshot:', error);
    throw new Error(`Screenshot upload failed: ${error.message}`);
  }
};

// Get signed URL for private files (for admin access)
export const getSignedUrl = async (fileName, expirationMinutes = 60) => {
  try {
    const file = bucket.file(fileName);

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expirationMinutes * 60 * 1000,
    });

    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error(`Failed to generate access URL: ${error.message}`);
  }
};

// List files in a folder
export const listFiles = async (folder = '') => {
  try {
    const [files] = await bucket.getFiles({
      prefix: folder,
    });

    return files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      created: file.metadata.timeCreated,
      updated: file.metadata.updated,
      isPublic: file.isPublic(),
      publicUrl: file.isPublic() ? `https://storage.googleapis.com/${bucketName}/${file.name}` : null
    }));
  } catch (error) {
    console.error('Error listing files:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
};

// Delete file
export const deleteFile = async (fileName) => {
  try {
    await bucket.file(fileName).delete();
    return { success: true, message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

// Setup bucket with CDN (run once)
export const setupBucketWithCDN = async () => {
  try {
    // Create bucket if it doesn't exist
    const [bucketExists] = await bucket.exists();
    if (!bucketExists) {
      await storage.createBucket(bucketName, {
        location: 'US',
        storageClass: 'STANDARD',
      });
      console.log(`Bucket ${bucketName} created.`);
    }

    // Set bucket to serve static content
    await bucket.setCorsConfiguration([
      {
        origin: ['*'],
        method: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
        responseHeader: ['Content-Type', 'Access-Control-Allow-Origin'],
        maxAgeSeconds: 3600,
      },
    ]);

    // Set public read policy for public files
    await bucket.iam.setPolicy({
      bindings: [
        {
          role: 'roles/storage.objectViewer',
          members: ['allUsers'],
        },
      ],
    });

    console.log(`Bucket ${bucketName} configured for CDN and public access.`);
    return { success: true, message: 'Bucket configured successfully' };
  } catch (error) {
    console.error('Error setting up bucket:', error);
    throw new Error(`Bucket setup failed: ${error.message}`);
  }
};

export default {
  uploadToGCS,
  uploadPaymentScreenshot,
  getSignedUrl,
  listFiles,
  deleteFile,
  setupBucketWithCDN
};