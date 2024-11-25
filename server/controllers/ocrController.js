const { Storage } = require("@google-cloud/storage");
const vision = require("@google-cloud/vision");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(
    __dirname,
    "/Users/shafquat/Documents/GitHub/mern-e-commerce/server/decisive-cinema-442805-t7-8514dd159261.json"
  ),
});

// Google Vision OCR
const googleOCR = async (imageBuffer) => {
  try {
    console.log("Google OCR processing started..."); // Log start
    const [result] = await client.documentTextDetection(
      Buffer.from(imageBuffer, "base64")
    );
    console.log("Google OCR processing finished successfully."); // Log success
    const fullText = result.fullTextAnnotation?.text || "No text found.";
    return fullText;
  } catch (error) {
    console.error("Google OCR failed:", error);
    throw new Error("Google OCR processing failed.");
  }
};

module.exports = { googleOCR };
