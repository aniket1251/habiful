import cloudinary from "../config/cloudinary";

export function uploadToCloudinary(
  fileBuffer: Buffer,
  publicId: string,
  folder: string = "properties"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
}
