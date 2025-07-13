import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse multipart/form-data
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, uploadDir: "./uploads", keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { files } = await parseForm(req);

    const uploadedFile = files?.file;
    if (!uploadedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newPath = path.join(process.cwd(), "uploads", uploadedFile.originalFilename);
    fs.renameSync(uploadedFile.filepath, newPath);

    return res.status(200).json({ message: "File uploaded successfully", filePath: newPath });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "File upload failed", error: err.message });
  }
}
