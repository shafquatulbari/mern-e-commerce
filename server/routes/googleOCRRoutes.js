const express = require("express");
const { googleOCR } = require("../controllers/ocrController");

const router = express.Router();

router.post("/ocr", async (req, res) => {
  try {
    console.log("Google OCR endpoint hit"); // Log to verify the endpoint is called
    const imageBuffer = req.body.image;
    const text = await googleOCR(imageBuffer);

    res.json({ text });
  } catch (error) {
    console.error("Error in OCR endpoint:", error);
    res.status(500).json({ message: "Error processing the image for OCR." });
  }
});

module.exports = router;
