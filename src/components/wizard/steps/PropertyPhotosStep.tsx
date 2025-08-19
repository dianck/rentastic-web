"use client";

import React, { useState } from "react";

const UploadPhotos: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  const appendFiles = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(fileList)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    appendFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    appendFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>What does your hotel look like?</h2>
      <p>
        Upload at least <b>5 photos</b> of your property. The more you upload,
        the more likely you are to get bookings. You can add more later.
      </p>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
          Drag and drop or <b>Upload photos</b>
        </label>
      </div>

      {/* Preview Images */}
      {files.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "10px",
          }}
        >
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                border: "1px solid #ddd",
                padding: "5px",
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                style={{
                  width: "100%",
                  height: "80px",
                  objectFit: "cover",
                }}
              />
              <button
                onClick={() => handleRemove(index)}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Continue Button */}
      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            padding: "10px 20px",
            background: "#006ce4",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          disabled={files.length < 5}
        >
          Continue
        </button>
        {files.length < 5 && (
          <p style={{ color: "red" }}>Please upload at least 5 photos.</p>
        )}
      </div>
    </div>
  );
};

export default UploadPhotos;
