import React, { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";

const FileScanner = () => {
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target?.result;
        setFileContent(fileData);

        // Start OCR process if the file is an image
        if (file.type.startsWith("image/")) {
          processOCR(fileData, file);
        } else {
          setOcrResult("OCR supports image files only.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const preprocessImage = async (file) => {
    // You can use a library like `sharp` for preprocessing if needed.
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Convert image to grayscale
        ctx.filter = "grayscale(100%)";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL());
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const processOCR = async (imageData, file) => {
    setLoading(true);
    setError(null);
    setOcrResult(null);

    try {
      const preprocessedImage = await preprocessImage(file);

      const {
        data: { text },
      } = await Tesseract.recognize(preprocessedImage, "eng", {
        logger: (info) => console.log(info),
      });
      setOcrResult(text);
    } catch (tesseractError) {
      console.error(
        "Tesseract.js failed. Falling back to Google OCR.",
        tesseractError
      );

      try {
        console.log("Calling Google OCR endpoint"); // Log to verify the call
        const response = await axios.post("/google/ocr", {
          image: imageData, // Send the original image to backend
        });
        console.log("Google OCR response:", response.data); // Log response
        setOcrResult(response.data.text);
      } catch (googleError) {
        console.error("Google OCR failed.", googleError);
        setError("OCR failed. Please try again with a clearer image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-reader p-4">
      <label
        htmlFor="file-input"
        className="block mb-2 text-lg font-medium text-gray-700"
      >
        Upload a File (Image for OCR)
      </label>
      <input
        type="file"
        id="file-input"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
      />
      {fileName && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">File Name:</h3>
          <p>{fileName}</p>
        </div>
      )}
      {fileContent && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Preview:</h3>
          <img
            src={fileContent}
            alt="Uploaded File"
            className="max-w-full max-h-60 border rounded-lg"
          />
        </div>
      )}
      {loading && (
        <div className="mt-4 text-blue-500">
          <p>Processing OCR... Please wait.</p>
        </div>
      )}
      {ocrResult && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Extracted Text:</h3>
          <pre className="p-2 bg-gray-100 rounded-lg max-h-60 overflow-auto text-sm">
            {ocrResult}
          </pre>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileScanner;
