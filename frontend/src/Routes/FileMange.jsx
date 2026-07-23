import { useEffect, useState } from "react";
import { FileManager } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import { useNavigate, useSearchParams } from "react-router-dom";

function FileManage() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const path = searchParams.get("path") ;

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
          setFiles([]);
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
      files={files}
      height="100%"
      initialPath={path ? path:"/"}
      enableFilePreview={false}

      uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/filemanage/upload`}

      onDownload={handleDownload}

      onRename={async (file, newName) => {
        await renameFile({
          path: file.path,
          newName,
        });
      }}
      fileUploadConfig={{
          url: `${import.meta.env.VITE_BACKEND_URL}/filemanage/upload`,
          method: "POST",
          withCredentials: true,
        }}
      onFileUploading={(file, parentFolder) => {
        console.log("Uploading:", file);
        console.log("Parent Folder:", parentFolder);
        console.log("Current Path:", path);

        return {
          path: parentFolder ? parentFolder.path : "/", // sent in FormData
        };
      }}
      onFileUploaded={(response) => {
          console.log("Uploaded response:", response);

          try {
            const uploadedFile =
              typeof response === "string"
                ? JSON.parse(response)
                : response;

            setFiles((prev) => [
              ...prev,
              {
                name: uploadedFile.name,
                isDirectory: false,
                path: uploadedFile.path,
                updatedAt:
                  uploadedFile.updatedAt || new Date().toISOString(),
                size: uploadedFile.size || 0,
                downloadUrl: uploadedFile.downloadUrl || null,
              },
            ]);
          } catch (err) {
            console.error(err);
            window.location.reload();
          }
        }}  

      onFileOpen={(file) => {
        console.log("Opening:", file);
        if (file.isDirectory) {
          navigate(`/filemanage?path=${file.path}`);
        }
      }}

      onCreateFolder={async (name, parentFolder) => {}}
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

  window.location.reload();
  return data;
}

export const handleDownload = (file) => {
  if (!file[0].downloadUrl) {
    // console.log(file[0], file[0].downloadUrl);
    alert("No download URL available");
    return;
  }

  window.open(file[0].downloadUrl, "_blank");
}