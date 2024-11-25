import React, { useState } from "react";
import api from "../services/api";
import axios from "axios";

const FileScanner = () => {
  const [fileName, setFileName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileData = e.target.result;
        setPreview(fileData);

        // Resize and send file
        setLoading(true);
        setError(null);
        try {
          const resizedFile = await resizeImage(file);
          const result = await processOCR(resizedFile);
          setOcrResult(result);
        } catch (ocrError) {
          console.error("OCR Processing Failed:", ocrError);
          setError("Failed to process the image. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const resizeImage = async (file) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        const maxDim = 1024;
        const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.7 // Compression quality
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const processOCR = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("google/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.text || "No text detected.";
    } catch (error) {
      console.error("Google OCR API Error:", error);
      throw new Error("OCR API failed.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">File Scanner</h1>
      <label
        htmlFor="file-input"
        className="block text-lg font-medium text-gray-700 mb-2"
      >
        Upload an Image
      </label>
      <input
        type="file"
        id="file-input"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded-lg p-2"
      />
      {fileName && (
        <p className="mt-2 text-gray-700">
          <strong>File Name:</strong> {fileName}
        </p>
      )}
      {preview && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Preview:</h3>
          <img
            src={preview}
            alt="Uploaded File"
            className="border rounded-lg max-w-full max-h-60"
          />
        </div>
      )}
      {loading && <p className="mt-4 text-blue-500">Processing OCR...</p>}
      {ocrResult && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Extracted Text:</h3>
          <pre className="bg-gray-100 p-2 rounded-lg text-sm overflow-auto max-h-60">
            {ocrResult}
          </pre>
        </div>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default FileScanner;
