import { User } from "../models/user.model.js";
import { File } from "../models/entry.model.js";
import { uploadFileToTelegram } from "../services/telegramService.js";

const resolvePathToParent = async (path, ownerId, createIfMissing = false) => {
    if (!path || path === "/") return null;

    const parts = path.split("/").filter(Boolean);

    let currentParent = null;

    for (const part of parts) {
        let folder = await File.findOne({
            name: part,
            parent: currentParent,
            owner: ownerId,
            type: "folder"
        });

        // 🔥 If not found → create (only if allowed)
        if (!folder) {
            if (!createIfMissing) {
                throw new Error(`Folder "${part}" not found`);
            }

             try {
                // 🔥 RACE CONDITION ZONE
                folder = await File.create({
                    name: part,
                    type: "folder",
                    parent: currentParent,
                    owner: ownerId
                });

            } catch (err) {
                // 🔥 HANDLE DUPLICATE CREATION
                if (err.code === 11000) {
                    // someone else created it just now
                    folder = await File.findOne({
                        name: part,
                        parent: currentParent,
                        owner: ownerId,
                        type: "folder"
                    });
                } else {
                    throw err;
                }
            }
        }

        currentParent = folder._id;
    }

    return currentParent;
};


const _uploadAndSaveFile = async (
    telegramBotToken,
    telegramChatId,
    name,
    mimetype,
    size,
    buffer,
    path,   // ✅ ADD THIS
    ownerId // (your "id")
) => {
    try {
        // 1️⃣ Resolve path → parentId (auto-create folders)
        const parentId = await resolvePathToParent(path, ownerId, true);

        // 2️⃣ Prevent duplicate file in same folder
        const exists = await File.findOne({
            name,
            parent: parentId,
            owner: ownerId
        });

        if (exists) {
            throw new Error("File already exists in this folder");
        }

        // 3️⃣ Upload to Telegram
        const {
            fileId,
            filePath,
            downloadUrl,
            thumbnailUrl
        } = await uploadFileToTelegram(
            telegramBotToken,
            telegramChatId,
            name,
            mimetype,
            size,
            buffer
        );

        // 4️⃣ Save in DB
        const fileDoc = await File.create({
            name,
            type: "file",
            parent: parentId,
            owner: ownerId,

            mimeType: mimetype,
            telegramFileId: fileId,
            size,
            downloadURL: downloadUrl,
            thumbnailUrl
        });

        // 5️⃣ Return success
        return {
            success: true,
            file: {
                name,
                isDirectory: false,
                path: path,
                updatedAt: fileDoc.updatedAt,
                size,
                fileId,
                downloadUrl
            }
        };

    } catch (err) {
        console.log("Error uploading file:", err);

        return {
            success: false,
            error: err.message
        };
    }
};


const _cleanupTempPath = async (file) => {
    if (!file || !file.path) return;
    try {
        await fs.promises.unlink(file.path);
        console.log(`Temp file cleaned up: ${file.path}`);
    } catch (err) {
        // Not critical, just log
        console.warn(`Could not remove temp file: ${file.path}`, err.message);
    }
};

const deleteRecursive = async (parentId, ownerId) => {
    // find children
    const children = await File.find({
        parent: parentId,
        owner: ownerId
    });

    for (const child of children) {
        if (child.type === "folder") {
            await deleteRecursive(child._id, ownerId);
        }

        await File.findByIdAndDelete(child._id);
    }
};

export const uploadFile = async (req, res) => {
    const path = req.query.path || "/";
    const ownerId = req.id.id;

    const { telegramBotToken, telegramChatId } = req;
    const uploadedFile = req.file;

    try {
        // 1️⃣ Validate file
        if (!uploadedFile) {
            return res.status(400).json({
                success: false,
                message: "No file provided"
            });
        }

        // 2️⃣ Extract file data
        const {
            originalname: name,
            mimetype,
            size,
            buffer
        } = uploadedFile;

        // 3️⃣ Upload + save
        const result = await _uploadAndSaveFile(
            telegramBotToken,
            telegramChatId,
            name,
            mimetype,
            size,
            buffer,
            path,
            ownerId
        );

        // 4️⃣ Cleanup (non-blocking is better)
        _cleanupTempPath(uploadedFile).catch(err =>
            console.warn("Cleanup error:", err.message)
        );

        // 5️⃣ Handle failure
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error
            });
        }

        const file = result.file;
        console.log("really lil bro",file);

        // 6️⃣ Return frontend-friendly response
        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            file: {
                name: file.name,
                isDirectory: false,
                path: file.path,              // assuming you stored it
                updatedAt: file.updatedAt,
                size: file.size,
                fileId: file.telegramFileId,
                downloadUrl: file.downloadURL
            }
        });

    } catch (err) {
        console.error("Error in uploadFile controller:", err);

        return res.status(500).json({
            success: false,
            message: "An error occurred while uploading the file"
        });
    }
};

export const viewFile = async (req, res) => {
    const path = req.query.path || "/";
    const ownerId = req.id.id;

    try {
        const parentId = await resolvePathToParent(path, ownerId);

        const files = await File.find({
            parent: parentId,
            owner: ownerId
        })
        .select("name type updatedAt size path downloadURL telegramFileId")
        .lean();

        return res.status(200).json({
            success: true,
            files: files.map(f => ({
                name: f.name,
                isDirectory: f.type === "folder",
                path: f.path,
                updatedAt: f.updatedAt,
                size: f.size || 0,
                fileId: f.telegramFileId,
                downloadUrl: f.downloadURL
            }))
        });

    } catch (err) {
        console.error("Error in viewFile controller:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteFileOrFolder = async (req, res) => {
    const path = req.query.path;
    const ownerId = req.id.id;

    if (!path || path === "/") {
        return res.status(400).json({
            success: false,
            message: "Cannot delete root"
        });
    }

    try {
        // 🔹 split path → get parent folder + target name
        const parts = path.split("/").filter(Boolean);
        const targetName = parts.pop();
        const parentPath = "/" + parts.join("/");

        // 🔹 resolve parent folder
        const parentId = await resolvePathToParent(parentPath, ownerId);

        // 🔹 find target
        const target = await File.findOne({
            name: targetName,
            parent: parentId,
            owner: ownerId
        });

        if (!target) {
            return res.status(404).json({
                success: false,
                message: "File/Folder not found"
            });
        }

        // 🔥 if folder → delete children first
        if (target.type === "folder") {
            await deleteRecursive(target._id, ownerId);
        }

        // 🔥 delete target
        await File.findByIdAndDelete(target._id);

        return res.status(200).json({
            success: true,
            message: "Deleted successfully"
        });

    } catch (err) {
        console.error("Delete error:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const renameFileOrFolder = async (req, res) => {
    const { path, newName } = req.body;
    const ownerId = req.id.id;

    if (!path || !newName) {
        return res.status(400).json({
            success: false,
            message: "Path and newName are required"
        });
    }

    try {
        // 🔹 split path
        const parts = path.split("/").filter(Boolean);
        const oldName = parts.pop();
        const parentPath = "/" + parts.join("/");

        // 🔹 resolve parent
        const parentId = await resolvePathToParent(parentPath, ownerId);

        // 🔹 find target
        const target = await File.findOne({
            name: oldName,
            parent: parentId,
            owner: ownerId
        });

        if (!target) {
            return res.status(404).json({
                success: false,
                message: "File/Folder not found"
            });
        }

        // 🔹 check duplicate name
        const exists = await File.findOne({
            name: newName,
            parent: parentId,
            owner: ownerId
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Name already exists in this folder"
            });
        }

        const oldPath = target.path;
        const newPath = parentPath === "/"
            ? `/${newName}`
            : `${parentPath}/${newName}`;

        // 🔥 Update target
        target.name = newName;
        target.path = newPath;
        await target.save();

        // 🔥 If folder → update children paths
        if (target.type === "folder") {
            await File.updateMany(
                {
                    path: { $regex: `^${oldPath}/` },
                    owner: ownerId
                },
                [
                    {
                        $set: {
                            path: {
                                $replaceOne: {
                                    input: "$path",
                                    find: oldPath,
                                    replacement: newPath
                                }
                            }
                        }
                    }
                ]
            );
        }

        return res.status(200).json({
            success: true,
            message: "Renamed successfully"
        });

    } catch (err) {
        console.error("Rename error:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const createFolder = async (req, res) => {
    const path = req.query.path || "/";
    const ownerId = req.id.id;
    const { folderName } = req.body;

    if (!folderName || !folderName.trim()) {
        return res.status(400).json({
            success: false,
            message: "Folder name is required"
        });
    }

    try {
        // Resolve current path (parent folder)
        const parentId = await resolvePathToParent(
            path,
            ownerId,
            true
        );

        // Prevent duplicate folder in same location
        const exists = await File.findOne({
            name: folderName,
            parent: parentId,
            owner: ownerId,
            type: "folder"
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Folder already exists"
            });
        }

        // Build full folder path
        const folderPath =
            path === "/" || !path
                ? `/${folderName}`
                : `${path}/${folderName}`;

        // Create folder
        const folder = await File.create({
            name: folderName,
            type: "folder",
            parent: parentId,
            owner: ownerId,
            path: folderPath
        });

        return res.status(200).json({
            success: true,
            message: "Folder created successfully",
            folder: {
                name: folder.name,
                isDirectory: true,
                path: folder.path,
                updatedAt: folder.updatedAt
            }
        });

    } catch (err) {
        console.error("Create folder error:", err);

        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong"
        });
    }
};

export const moveFileOrFolder = async (req, res) => {
    const { sourcePath, destinationPath } = req.body;
    const ownerId = req.id.id;

    if (!sourcePath || !destinationPath) {
        return res.status(400).json({
            success: false,
            message: "sourcePath and destinationPath are required"
        });
    }

    if (sourcePath === "/") {
        return res.status(400).json({
            success: false,
            message: "Cannot move root"
        });
    }

    try {
        // 🔹 Split source path
        const parts = sourcePath.split("/").filter(Boolean);
        const name = parts.pop();
        const parentPath = "/" + parts.join("/");

        // 🔹 Resolve source parent
        const sourceParentId = await resolvePathToParent(parentPath, ownerId);

        // 🔹 Find target file/folder
        const target = await File.findOne({
            name,
            parent: sourceParentId,
            owner: ownerId
        });

        if (!target) {
            return res.status(404).json({
                success: false,
                message: "Source not found"
            });
        }

        // 🔹 Resolve destination (auto-create folders)
        const destParentId = await resolvePathToParent(destinationPath, ownerId, true);

        // 🚫 Prevent duplicate in destination
        const exists = await File.findOne({
            name: target.name,
            parent: destParentId,
            owner: ownerId
        });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "File/Folder already exists in destination"
            });
        }

        // 🚫 Prevent moving folder into itself
        if (target.type === "folder") {
            if (destinationPath.startsWith(target.path)) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot move folder inside itself"
                });
            }
        }

        // 🔥 Build new path
        const newPath = destinationPath === "/"
            ? `/${target.name}`
            : `${destinationPath}/${target.name}`;

        const oldPath = target.path;

        // 🔹 Update target
        target.parent = destParentId;
        target.path = newPath;
        await target.save();

        // 🔥 If folder → update all children paths
        if (target.type === "folder") {
            await File.updateMany(
                {
                    path: { $regex: `^${oldPath}/` },
                    owner: ownerId
                },
                [
                    {
                        $set: {
                            path: {
                                $replaceOne: {
                                    input: "$path",
                                    find: oldPath,
                                    replacement: newPath
                                }
                            }
                        }
                    }
                ]
            );
        }

        return res.status(200).json({
            success: true,
            message: "Moved successfully",
            data: {
                name: target.name,
                isDirectory: target.type === "folder",
                path: newPath,
                updatedAt: target.updatedAt,
                size: target.size || 0
            }
        });

    } catch (err) {
        console.error("Move error:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};