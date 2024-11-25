const multer = require("multer");
const express = require("express");
const { googleOCR } = require("../controllers/ocrController");

const router = express.Router();

// Configure multer
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB limit

// Google Vision OCR endpoint
router.post("/ocr", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file provided." });
  }

  try {
    const text = await googleOCR(file.buffer);
    res.json({ text });
  } catch (error) {
    console.error("Google OCR Error:", error);
    res.status(500).json({ message: "Failed to process the image for OCR." });
  }
});

module.exports = router;
