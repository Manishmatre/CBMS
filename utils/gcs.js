import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  GCP_PROJECT_ID,
  GCS_BUCKET_NAME
} = process.env;

const storage = new Storage({
  projectId: GCP_PROJECT_ID,
  keyFilename: path.join(__dirname, 'cbmsvehicledocs-1d1679652825.json'),
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
    resumable: false,
  });
  // No ACLs or makePublic when uniform bucket-level access is enabled
  return `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${destination}`;
}

export default bucket;
