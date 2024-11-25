import React, { useState, useContext } from "react";
import api from "../services/api";
import {
  FaShoppingCart,
  FaUpload,
  FaSearch,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext"; // Add CartContext

const FileScanner = () => {
  const [fileName, setFileName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ocrText, setOcrText] = useState(null); // Store extracted text
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addItem } = useContext(CartContext); // Access cart context

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
          const ocrResult = await processOCR(resizedFile);
          setOcrText(ocrResult); // Store OCR text
          await fetchProducts(ocrResult);
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

      return response.data.text || "";
    } catch (error) {
      console.error("Google OCR API Error:", error);
      throw new Error("OCR API failed.");
    }
  };

  const fetchProducts = async (ocrText) => {
    try {
      const response = await api.get("products/searchOCR", {
        params: { search: ocrText },
      });
      setProducts(response.data);
    } catch (fetchError) {
      console.error("Error fetching products:", fetchError);
      setError("No medicines with the names in our store.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8 flex items-center justify-center gap-3">
        <FaSearch className="text-blue-600" /> Prescription Scanner
      </h1>
      <label
        htmlFor="file-input"
        className="block text-xl font-semibold text-gray-700 mb-4 text-center flex items-center justify-center gap-2"
      >
        <FaUpload className="text-gray-500" />
        Upload a Prescription Image
      </label>
      <div className="flex flex-col items-center">
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-1/2 border border-gray-300 rounded-lg p-2 mb-6"
        />
        {fileName && (
          <p className="mt-2 text-gray-700 text-center text-lg">
            <strong>File Name:</strong> {fileName}
          </p>
        )}
        {preview && (
          <div className="mt-6 flex justify-center">
            <div className="border p-4 rounded-lg">
              <h3 className="text-xl font-bold text-center mb-4">Preview</h3>
              <img
                src={preview}
                alt="Uploaded File"
                className="border rounded-lg max-w-full max-h-60 mx-auto"
              />
            </div>
          </div>
        )}
        {ocrText && (
          <div className="mt-8 w-full">
            <h3 className="text-xl font-bold mb-4 text-center">
              Extracted Text:
            </h3>
            <p className="bg-gray-100 p-4 rounded-lg text-md text-gray-700 max-w-3xl mx-auto">
              {ocrText}
            </p>
          </div>
        )}
        {loading && (
          <p className="mt-8 text-blue-500 text-center text-lg flex items-center justify-center">
            <FaCheckCircle className="mr-2 text-blue-500" />
            Processing OCR... Please wait.
          </p>
        )}
      </div>
      {!loading && products.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-center mt-10 mb-6">
            Search Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-lg shadow-md bg-white transition-all transform hover:scale-105 hover:shadow-2xl hover:border-blue-500"
              >
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-lg font-bold mb-2 text-blue-600 hover:underline text-center">
                    {product.name}
                  </h3>
                  <img
                    src={
                      product.images?.[0] || "https://via.placeholder.com/300"
                    }
                    alt={product.name}
                    className="w-full h-60 object-cover mb-4 rounded-md"
                  />
                </Link>
                <p className="text-lg text-green-600 font-semibold mb-2 text-center">
                  Price: ${product.price}
                </p>
                <button
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center"
                  onClick={() => addItem(product._id, 1)} // Add to cart
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {!loading && products.length === 0 && error && (
        <p className="mt-10 text-red-500 text-center text-lg">{error}</p>
      )}
    </div>
  );
};

export default FileScanner;
