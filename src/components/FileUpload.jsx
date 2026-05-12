import { useState } from "react";

const API_BASE_URL = "http://localhost:8000";

function FileUpload({ onUploadComplete, onUploadStart, onUploadError }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleUpload = async () => {
    if (!files.length) {
      const message = "ファイルを選択してください。";
      onUploadError?.(message);
      return;
    }

    try {
      setUploading(true);
      onUploadStart?.();

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "アップロードに失敗しました。");
      }

      onUploadComplete?.(data.documents || []);
    } catch (error) {
      console.error(error);
      onUploadError?.(error.message || "アップロードに失敗しました。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={styles.input}
      />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "アップロード中..." : "アップロード実行"}
      </button>

      {files.length > 0 && (
        <div style={styles.fileList}>
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`}>{file.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "8px 0",
  },
  fileList: {
    fontSize: "14px",
    color: "#444",
  },
};

export default FileUpload;