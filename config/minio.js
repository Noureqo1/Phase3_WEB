const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true" || false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "clipsphere-videos";

/**
 * Initialize MinIO bucket if it doesn't exist
 */
const initMinIO = async () => {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
      console.log(`MinIO bucket '${BUCKET_NAME}' created successfully`);

      // Set bucket policy to allow public read access to objects
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    } else {
      console.log(`MinIO bucket '${BUCKET_NAME}' already exists`);
    }
  } catch (error) {
    console.error("Error initializing MinIO:", error.message);
    throw error;
  }
};

/**
 * Generate presigned URL for video download
 */
const generatePresignedUrl = async (objectKey, expirySeconds = 3600) => {
  try {
    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      objectKey,
      expirySeconds
    );
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error.message);
    throw error;
  }
};

/**
 * Generate presigned URL for video upload
 */
const generateUploadPresignedUrl = async (objectKey, expirySeconds = 3600) => {
  try {
    const url = await minioClient.presignedPutObject(
      BUCKET_NAME,
      objectKey,
      expirySeconds
    );
    return url;
  } catch (error) {
    console.error("Error generating upload presigned URL:", error.message);
    throw error;
  }
};

/**
 * Upload file to MinIO
 */
const uploadFile = async (objectKey, fileStream, size, contentType) => {
  try {
    await minioClient.putObject(
      BUCKET_NAME,
      objectKey,
      fileStream,
      size,
      { "Content-Type": contentType }
    );
    return true;
  } catch (error) {
    console.error("Error uploading file to MinIO:", error.message);
    throw error;
  }
};

/**
 * Delete file from MinIO
 */
const deleteFile = async (objectKey) => {
  try {
    await minioClient.removeObject(BUCKET_NAME, objectKey);
    return true;
  } catch (error) {
    console.error("Error deleting file from MinIO:", error.message);
    throw error;
  }
};

module.exports = {
  minioClient,
  initMinIO,
  generatePresignedUrl,
  generateUploadPresignedUrl,
  uploadFile,
  deleteFile,
  BUCKET_NAME,
};
