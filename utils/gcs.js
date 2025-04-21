import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
dotenv.config();

const {
  GCP_PROJECT_ID,
  GCP_CLIENT_EMAIL,
  GCP_PRIVATE_KEY,
  GCS_BUCKET_NAME
} = process.env;

const privateKey = GCP_PRIVATE_KEY.replace(/\\n/g, '\n');

const storage = new Storage({
  projectId: GCP_PROJECT_ID,
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: privateKey,
  },
});

const bucket = storage.bucket(GCS_BUCKET_NAME);

/**
 * Uploads a file buffer to GCS and returns the public URL.
 * @param {Buffer} buffer - File buffer
 * @param {string} destination - Destination filename in GCS
 * @param {string} mimetype - File mimetype
 * @returns {Promise<string>} Public URL
 */
export async function uploadFileToGCS(buffer, destination, mimetype) {
  const file = bucket.file(destination);
  await file.save(buffer, {
    metadata: { contentType: mimetype },
    public: true,
    resumable: false,
  });
  await file.makePublic();
  return `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${destination}`;
}

export default bucket;
