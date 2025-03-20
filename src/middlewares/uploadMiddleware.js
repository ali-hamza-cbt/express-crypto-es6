import multer from "multer";
import path from "path";
import fs from "fs/promises"; // Use async file operations
import crypto from "crypto"; // For generating a random string

// Create storage dynamically
const storage = (folder) =>
  multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        const uploadPath = path.join("public", "images", folder);

        // Ensure the directory exists
        await fs.mkdir(uploadPath, { recursive: true });

        cb(null, uploadPath);
      } catch (err) {
        cb(err, null);
      }
    },
    filename: (req, file, cb) => {
      // Generate a random string
      const randomString = crypto.randomBytes(5).toString("hex"); // Generates a 10-character random string

      // Ensure a safe file name (replace spaces with underscores)
      const fileName = file.originalname.replace(/\s+/g, "_");

      // Construct the new file name
      const uniqueName = `${Date.now()}_${fileName}_${randomString}${path.extname(file.originalname)}`;

      cb(null, uniqueName);
    },
  });

// File filter (only allow images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  cb(null, allowedTypes.includes(file.mimetype));
};

// Upload function with limits (security enhancement)
const upload = (folder) =>
  multer({
    storage: storage(folder),
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  });

export default upload;
