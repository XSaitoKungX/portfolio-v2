/**
 * Cloudinary Configuration and Upload Utilities
 */

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload image to Cloudinary
 * @param file - Base64 data URL or file path
 * @param folder - Cloudinary folder (e.g., 'avatars', 'banners')
 * @param publicId - Optional custom public ID
 */
export async function uploadImage(
  file: string,
  folder: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `eziox/${folder}`,
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

/**
 * Upload avatar with optimizations
 */
export async function uploadAvatar(
  file: string,
  userId: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'eziox/avatars',
    public_id: `avatar_${userId}`,
    overwrite: true,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  })

  return result.secure_url
}

/**
 * Upload banner with optimizations
 */
export async function uploadBanner(
  file: string,
  userId: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder: 'eziox/banners',
    public_id: `banner_${userId}`,
    overwrite: true,
    transformation: [
      { width: 1200, height: 400, crop: 'fill' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  })

  return result.secure_url
}
