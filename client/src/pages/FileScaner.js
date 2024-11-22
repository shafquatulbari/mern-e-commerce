import React, { useState } from "react";

const FileScaner = () => {
  const [fileContent, setFileContent] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target?.result);
      };

      reader.readAsText(file); // You can change this to readAsDataURL for images
    }
  };

  return (
    <div className="file-upload-reader p-4">
      <label
        htmlFor="file-input"
        className="block mb-2 text-lg font-medium text-gray-700"
      >
        Upload a File
      </label>
      <input
        type="file"
        id="file-input"
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
          <h3 className="text-xl font-bold">File Content:</h3>
          <pre className="p-2 bg-gray-100 rounded-lg max-h-60 overflow-auto text-sm">
            {fileContent.toString()}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FileScaner;
