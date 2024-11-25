import React, { useState } from "react";
import Tesseract from "tesseract.js";

const FileScanner = () => {
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
          processOCR(fileData);
        } else {
          setOcrResult("OCR supports image files only.");
        }
      };

      // Use readAsDataURL for images
      reader.readAsDataURL(file);
    }
  };

  const processOCR = async (imageData) => {
    setLoading(true);
    setOcrResult(null);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageData, "eng", {
        logger: (info) => console.log(info), // Logs progress
      });
      setOcrResult(text);
    } catch (error) {
      console.error("OCR Error:", error);
      setOcrResult("Failed to extract text. Please try again.");
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
    </div>
  );
};

export default FileScanner;
