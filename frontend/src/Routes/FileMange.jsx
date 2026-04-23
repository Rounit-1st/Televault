import { useEffect, useState } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import { useNavigate, useSearchParams } from "react-router-dom";

function FileManage() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const path = searchParams.get("path") || "/";

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/filemanage/view?path=${encodeURIComponent(path)}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        console.log("API:", data);

        // 🚨 Case 1: Not authorized
        if (data.success === false && data.message === "Not authorized") {
          alert("Please login first");

          setTimeout(() => {
            navigate("/");
          }, 3000);

          return;
        }

        if (data.success === false && data.message === "Invalid Token") {
          alert("Session expired. Please login again.");

          setTimeout(() => {
            navigate("/");
          }, 3000);

          return;
        }

        // 🚨 Case 2: Telegram API not set
        if (data.success === false && data.message === "telegram api is empty") {
          alert("Telegram API not configured");

          setTimeout(() => {
            navigate("/telegramApiManage");
          }, 3000);

          return;
        }

        // ✅ Normal case
        if (data.success === true) {
          const formattedFiles = data.files.map((file, index) => ({
            name: file.name || `file-${index}`, // fallback
            isDirectory: file.isDirectory,
            path: file.path || `${path}${file.name ? file.name : `file-${index}`}`,
            updatedAt: file.updatedAt,
            size: file.size || 0,
            downloadUrl: file.downloadUrl || null,
          }));

          setFiles(formattedFiles);
        }

      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchFiles();
  }, [path]);

  return (
    <div style={{ height: "100vh" }}>
      <FileManager
        enableFilePreview = {false}
        onDownload={handleDownload}
        onCut={(file) => {
          alert("Cut not supported in this demo");
        }} 
        onCopy={(file) => {
          alert("Copy not supported in this demo");
        }}
        onRename={async (file, newName) => {
          const res = await renameFile({ path: file.path, newName });
        }}
        files={files}
        height="100%"
        initialPath={"/"}
        onFileOpen={(file) => {
          if (file.isDirectory) {
            navigate(`/filemanage?path=${file.path}`);
          }
        }}
        onUpload={(files) => {
          
        }}
      />
    </div>
  );
}

export default FileManage;

async function renameFile({ path, newName }) {
  console.log("Renaming:", path, "to", newName);
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/filemanage/rename`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ path, newName }),
    }
  );

  const data = await res.json();

  if (!res.ok || data.success === false) {
    alert(data.message || "Rename failed");
  }

  return data;
  window.location.reload();
}

export const handleDownload = (file) => {
  if (!file[0].downloadUrl) {
    // console.log(file[0], file[0].downloadUrl);
    alert("No download URL available");
    return;
  }

  window.open(file[0].downloadUrl, "_blank");
}

export async function uploadFiles({ files, path }) {
  const formData = new FormData();

  // multiple files support
  files.forEach((file) => {
    formData.append("file", file); // backend key = "file"
  });

  formData.append("path", path);

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/filemanage/upload`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
}