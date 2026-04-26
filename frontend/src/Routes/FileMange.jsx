import { useEffect, useState, useCallback, useRef } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../Components/Navbar";

// Safe path join — always produces an absolute path
function joinPath(base, name) {
  const cleanBase = base === "/" ? "" : base.replace(/\/+$/, "");
  const cleanName = String(name).replace(/^\/+/, "");
  return `${cleanBase}/${cleanName}`;
}

function FileManage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read path from URL — this is our source of truth
  const path = searchParams.get("path") || "/";

  // Track what path we last fetched so we can avoid stale updates
  const lastFetchedPath = useRef(null);

  const fetchFiles = useCallback(async (targetPath) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/filemanage/view?path=${encodeURIComponent(targetPath)}`,
        { method: "GET", credentials: "include" }
      );

      const data = await res.json();

      if (data.success === false) {
        if (data.message === "Not authorized") {
          alert("Please login first");
          setTimeout(() => navigate("/"), 3000);
          return;
        }
        if (data.message === "Invalid Token") {
          alert("Session expired. Please login again.");
          setTimeout(() => navigate("/"), 3000);
          return;
        }
        if (data.message === "telegram api is empty") {
          alert("Telegram API not configured");
          setTimeout(() => navigate("/telegramApiManage"), 3000);
          return;
        }
        setFiles([]);
        return;
      }

      if (data.success === true && Array.isArray(data.files)) {
        const formattedFiles = data.files.map((file, index) => {
          const name = file.name || `file-${index}`;

          // ✅ Always produce an absolute path: /images/photo.png
          // Never: /imagesphoto.png or relative paths
          const filePath = file.path?.startsWith("/")
            ? file.path
            : joinPath(targetPath, name);

          return {
            name,
            isDirectory: !!file.isDirectory,
            path: filePath,
            updatedAt: file.updatedAt,
            size: file.size || 0,
            downloadUrl: file.downloadUrl || null,
          };
        });

        lastFetchedPath.current = targetPath;
        setFiles(formattedFiles);
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch whenever the URL path changes (including on first load / refresh)
  useEffect(() => {
    fetchFiles(path);
  }, [path, fetchFiles]);

  // ✅ KEY INSIGHT:
  // We use `key={path}` to force a full remount when path changes via URL
  // AND we only render FileManager once files have loaded (so initialPath
  // is always consumed with real data present, never with empty array).
  //
  // But we do NOT block on loading after the first render — we track
  // whether this is the initial load so we only gate on first mount.
  if (loading && lastFetchedPath.current === null) {
    // Only show loading screen on the very first fetch (page load / refresh)
    // After that, let the FileManager keep showing stale data while refreshing
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <Navbar/>
      {/*
        ✅ key={path}: Forces full remount on URL path change.
           This resets initialPath consumption inside the library.
        ✅ initialPath={path}: Consumed fresh on each mount because
           we only mount after files are ready (first load gate above).
        ✅ No key or initialPath changes after mount — the library
           manages its own internal navigation from here.
      */}
      <FileManager
        key={path}
        files={files}
        height="100%"
        initialPath={path}
        enableFilePreview={false}
        onFolderChange={(folder) => {
          // ✅ When user clicks a folder inside FileManager,
          // push to URL. This triggers a re-fetch via useEffect.
          const newPath = folder?.path || "/";
          if (folder?.path) {
            navigate(`/filemanage?path=${encodeURIComponent(folder.path)}`);
          }
        }}
        onFileOpen={(file) => {
          if (file.isDirectory) {
            navigate(`/filemanage?path=${encodeURIComponent(file.path)}`);
          }
        }}
        onDownload={handleDownload}
        onCut={() => alert("Cut not supported")}
        onCopy={() => alert("Copy not supported")}
        onRename={async (file, newName) => {
          await renameFile({ path: file.path, newName });
          fetchFiles(path); // refresh current folder
        }}
        onUpload={async (selectedFiles) => {
          await uploadFiles({ files: selectedFiles, path });
          fetchFiles(path); // refresh current folder
        }}
        fileUploadConfig={{
          url: `${import.meta.env.VITE_BACKEND_URL}/filemanage/upload?path=${encodeURIComponent(path)}`,
          method: "POST",
          // headers: { "Content-Type": "multipart/form-data"},
          withCredentials: true,
        }}
        onFileUploaded={(response) => {
          console.log("Upload response:", response);

          try {
            const uploadedFile =
              typeof response === "string"
                ? JSON.parse(response)
                : response;

            const formattedFile = {
              name: uploadedFile.name,
              isDirectory: false,
              path:
                uploadedFile.path ||
                `${path === "/" ? "" : path}/${uploadedFile.name}`,
              updatedAt:
                uploadedFile.updatedAt || new Date().toISOString(),
              size: uploadedFile.size || 0,
              downloadUrl: uploadedFile.downloadUrl || null,
            };

            setFiles((prev) => [...prev, formattedFile]);
          } catch (err) {
            console.error("Upload parse error:", err);
            fetchFiles();
          }
        }}
        onFileUploading={(file, parentFolder) => {
          console.log("Uploading file:", file);
          console.log("Parent folder:", parentFolder);

          return {
            path: parentFolder?.path || path || "/",
          };
        }}
        onDelete={async (files) => {
          try {
            for (const file of files) {
              await deleteFileOrFolder(file.path);
            }

            fetchFiles();
          } catch (err) {
            console.error(err);
          }
        }}
        onCreateFolder={async (parentFolder, folderName) => {
          try {
            const parentPath = parentFolder?.path || path || "/";

            const fullPath =
              parentPath === "/"
                ? `/${folderName}`
                : `${parentPath}/${folderName}`;

            await createFolder(fullPath);

            fetchFiles();
          } catch (err) {
            console.error(err);
          }
        }}

      />
    </div>
  );
}

export default FileManage;

// --- Helpers (unchanged) ---

async function renameFile({ path, newName }) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/filemanage/rename`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ path, newName }),
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || "Rename failed");
  return data;
}

export const handleDownload = (file) => {
  const item = Array.isArray(file) ? file[0] : file;
  if (!item?.downloadUrl) { alert("No download URL available"); return; }
  window.open(item.downloadUrl, "_blank");
};

export async function uploadFiles({ files, path }) {
  const formData = new FormData();
  files.forEach((file) => formData.append("file", file));
  formData.append("path", path);
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/filemanage/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || "Upload failed");
  return data;
}

async function deleteFileOrFolder(path) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/filemanage/delete?path=${encodeURIComponent(path)}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok || data.success === false) {
      alert(data.message || "Delete failed");
      throw new Error(data.message || "Delete failed");
    }

    return data;
  } catch (err) {
    console.error("Delete error:", err);
    throw err;
  }
}

async function createFolder(folderPath) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/filemanage/create-folder`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          path: folderPath,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || data.success === false) {
      alert(data.message || "Folder creation failed");
      throw new Error(data.message || "Folder creation failed");
    }

    return data;
  } catch (err) {
    console.error("Create folder error:", err);
    throw err;
  }
}