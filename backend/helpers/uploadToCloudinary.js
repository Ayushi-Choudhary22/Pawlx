const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer (from multer memory storage) to Cloudinary.
 * @param {Buffer} fileBuffer
 * @param {string} folder - Cloudinary folder, e.g. 'pawlx/pets'
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadToCloudinary = (fileBuffer, folder = 'pawlx/misc') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
};

/**
 * Deletes an asset from Cloudinary by its public ID.
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
