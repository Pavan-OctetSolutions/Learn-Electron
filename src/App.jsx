import React, { useState } from "react";
import FileList from './FileList';

export default function App() {
  const [path, setPath] = useState("");
  const [files, setFiles] = useState([]);

  async function loadDirectory() {
    if (!path) return;

    const result = await window.api.readDirectory(path);

    if (result.error) {
      alert("error:" + result.error);
      return;
    }

    setFiles(result);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>File Manager Lite</h1>

      <input
        type="text"
        placeholder="Enter folder path"
        style={{ width: "400px", padding: "6px" }}
        value={path}
        onChange={(e) => setPath(e.target.value)}
      />

      <button
        onClick={loadDirectory}
        style={{ marginLeft: 10, padding: "6px 16px" }}
      >
        Load
      </button>

      <FileList files={files} />
    </div>
  );
}
