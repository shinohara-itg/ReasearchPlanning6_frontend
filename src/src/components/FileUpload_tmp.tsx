import React, { useState } from "react";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedNames, setUploadedNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
    setUploadedNames([]);
    setError("");
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("ファイルを選択してください。");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      setUploadedNames(data.filenames || []);
    } catch (err) {
      console.error(err);
      setError("アップロードに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>ファイルアップロード</h2>

      <input type="file" multiple onChange={handleChange} />

      <div style={{ marginTop: "12px" }}>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "アップロード中..." : "アップロード"}
        </button>
      </div>

      {selectedFiles.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <h3>選択ファイル</h3>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                {file.name} ({file.size} bytes)
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadedNames.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <h3>アップロード完了</h3>
          <ul>
            {uploadedNames.map((name, index) => (
              <li key={`${name}-${index}`}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: "red", marginTop: "12px" }}>{error}</p>}
    </div>
  );
};

export default FileUpload;