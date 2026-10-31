const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Validates real image magic bytes from the buffer
 * @param {Buffer} buffer
 * @returns {boolean}
 */
const isValidImageBuffer = (buffer) => {
  if (!buffer || buffer.length < 12) return false;

  // JPEG check: starts with 0xFF 0xD8 0xFF
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (isJpeg) return true;

  // PNG check: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  const isPng =
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;
  if (isPng) return true;

  // WebP check: RIFF....WEBP
  const isRiff =
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50;
  if (isRiff && isWebp) return true;

  return false;
};

/**
 * Uploads a memory buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer
 * @param {string} userId
 * @returns {Promise<Object>}
 */
const uploadAvatarStream = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'accept-defeat/avatars',
      public_id: `${userId}_${Date.now()}`,
      resource_type: 'image',
      overwrite: true,
      transformation: [
        {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          fetch_format: 'auto',
          quality: 'auto',
        },
      ],
    };

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    stream.end(buffer);
  });
};

/**
 * Safely deletes an old managed avatar from Cloudinary
 * Ensures external avatars (Google, GitHub) are never deleted
 * @param {string} publicId
 */
const safeDeleteAvatar = async (publicId) => {
  if (!publicId || typeof publicId !== 'string') return;
  // Safety rule: Only delete images belonging to this app's dedicated avatar folder
  if (!publicId.startsWith('accept-defeat/avatars/')) return;

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.error('Cloudinary cleanup error for publicId:', publicId, err?.message || err);
  }
};

module.exports = {
  cloudinary,
  isValidImageBuffer,
  uploadAvatarStream,
  safeDeleteAvatar,
};
