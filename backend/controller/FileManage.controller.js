import fs from 'fs';
import { File } from "../models/entry.model.js";
import { uploadFileToTelegram, getFileFromTelegram, downloadFileFromTelegram, deleteFileFromTelegram } from "../services/telegramService.js";

/**
 * Shared helper: Upload single file to Telegram and save metadata
 * @private
 */
const _uploadAndSaveFile = async (fileBuffer, originalname, mimetype, size, telegramBotToken, telegramChatId, userId) => {
    try {
        // Upload file to Telegram
        const { fileId, filePath, downloadUrl } = await uploadFileToTelegram(
            fileBuffer,
            telegramBotToken,
            telegramChatId,
            originalname
        );

        // Save metadata to MongoDB
        const fileMetadata = new File({
            originalName: originalname,
            mimeType: mimetype,
            size: size,
            telegramFileId: fileId,
            telegramFilePath: filePath,
            downloadUrl: downloadUrl,
            owner: userId
        });

        await fileMetadata.save();

        return {
            success: true,
            file: {
                id: fileMetadata._id,
                name: fileMetadata.originalName,
                size: fileMetadata.size,
                mimeType: fileMetadata.mimeType,
                uploadedAt: fileMetadata.uploadedAt,
                downloadUrl: fileMetadata.downloadUrl
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Failed to upload file"
        };
    }
};

/**
 * POST /upload
 * Upload file to Telegram and store metadata in MongoDB
 */
const _selectSingleFile = (req) => {
    if (req.file) return req.file;
    if (Array.isArray(req.files) && req.files.length > 0) return req.files[0];
    return null;
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

export const uploadFile = async (req, res) => {
    try {
        const uploadedFile = _selectSingleFile(req);

        if (!uploadedFile) {
            console.log("req.file:", req.file, "req.files:", req.files);
            return res.status(400).json({
                success: false,
                message: "No file provided. Use form-data key 'file' for single upload."
            });
        }

        const { telegramBotToken, telegramChatId, userId } = req;
        console.log('telegramChatId:', telegramChatId, 'telegramBotToken:', telegramBotToken ? '***' : 'Not provided');
        const { originalname, mimetype, size, buffer } = uploadedFile;

        // Use shared helper
        const result = await _uploadAndSaveFile(
            buffer,
            originalname,
            mimetype,
            size,
            telegramBotToken,
            telegramChatId,
            userId
        );

        try {
            await _cleanupTempPath(uploadedFile);
        } catch (cleanupError) {
            console.warn("Temp cleanup failed", cleanupError);
        }

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error
            });
        }

        return res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            file: result.file
        });
    } catch (error) {
        console.error("Error in uploadFile:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to upload file"
        });
    }
};

/**
 * POST /batch-upload
 * Upload multiple files to Telegram and store metadata
 * Max 10 files per request (sequential processing)
 */
export const uploadMultipleFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files provided"
            });
        }

        const { telegramBotToken, telegramChatId, userId } = req;

        // Enforce batch size limit
        if (req.files.length > 10) {
            return res.status(400).json({
                success: false,
                message: `Maximum 10 files per batch (received ${req.files.length}). Please use multiple requests.`
            });
        }

        const successful = [];
        const failed = [];

        // Process files sequentially to avoid Telegram rate limiting
        for (const file of req.files) {
            const { originalname, mimetype, size, buffer } = file;

            const result = await _uploadAndSaveFile(
                buffer,
                originalname,
                mimetype,
                size,
                telegramBotToken,
                telegramChatId,
                userId
            );

            try {
                await _cleanupTempPath(file);
            } catch (cleanupError) {
                console.warn("Batch temp cleanup failed for file", file.path, cleanupError);
            }

            if (result.success) {
                successful.push(result.file);
            } else {
                failed.push({
                    name: originalname,
                    error: result.error
                });
            }
        }

        const summary = {
            totalRequested: req.files.length,
            successCount: successful.length,
            failureCount: failed.length
        };

        // Return 201 if at least one file uploaded, 400 if all failed
        const statusCode = successful.length > 0 ? 201 : 400;

        return res.status(statusCode).json({
            success: successful.length > 0,
            message: `${successful.length} of ${req.files.length} files uploaded successfully`,
            summary,
            files: {
                successful,
                failed
            }
        });
    } catch (error) {
        console.error("Error in uploadMultipleFiles:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to process batch upload"
        });
    }
};

/**
 * GET /view
 * Return list of user files with pagination
 */
export const viewFiles = async (req, res) => {
    try {
        const { userId } = req;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count
        const totalFiles = await File.countDocuments({ owner: userId });

        // Get paginated files
        const files = await File.find({ owner: userId })
            .select('_id originalName mimeType size uploadedAt downloadUrl')
            .sort({ uploadedAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Files retrieved successfully",
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFiles / limit),
                totalFiles: totalFiles,
                filesPerPage: limit
            },
            files: files
        });
    } catch (error) {
        console.error("Error in viewFiles:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve files"
        });
    }
};

/**
 * GET /download/:id
 * Stream file to client
 */
export const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, telegramBotToken } = req;

        // Find file metadata
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        // Verify ownership
        if (file.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You don't have access to this file"
            });
        }

        // Download file from Telegram
        const fileBuffer = await downloadFileFromTelegram(file.downloadUrl);

        // Set response headers
        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.setHeader('Content-Length', fileBuffer.length);

        return res.status(200).send(fileBuffer);
    } catch (error) {
        console.error("Error in downloadFile:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to download file"
        });
    }
};

/**
 * PUT /rename/:id
 * Rename file in database (metadata only)
 */
export const renameFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { newName } = req.body;
        const { userId } = req;

        if (!newName || newName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "New filename is required"
            });
        }

        // Find file and verify ownership
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        if (file.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You don't have access to this file"
            });
        }

        // Update filename
        file.originalName = newName;
        file.updatedAt = new Date();
        await file.save();

        return res.status(200).json({
            success: true,
            message: "File renamed successfully",
            file: {
                id: file._id,
                name: file.originalName,
                size: file.size,
                mimeType: file.mimeType,
                uploadedAt: file.uploadedAt,
                updatedAt: file.updatedAt
            }
        });
    } catch (error) {
        console.error("Error in renameFile:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to rename file"
        });
    }
};

/**
 * DELETE /delete/:id
 * Delete file metadata from database and optionally delete from Telegram
 */
export const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, telegramBotToken, telegramChatId } = req;
        const { deleteFromTelegram = false } = req.body;

        // Find file and verify ownership
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        if (file.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You don't have access to this file"
            });
        }

        // Optionally delete from Telegram
        if (deleteFromTelegram) {
            // Note: Telegram file deletion requires message ID, not file ID
            // This would require storing message ID during upload
            console.warn("Telegram file deletion not yet implemented - requires message ID storage");
        }

        // Delete from MongoDB
        await File.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "File deleted successfully",
            deletedFile: {
                id: file._id,
                name: file.originalName
            }
        });
    } catch (error) {
        console.error("Error in deleteFile:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete file"
        });
    }
};

/**
 * GET /info/:id
 * Get file metadata
 */
export const getFileInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req;

        // Find file metadata
        const file = await File.findById(id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        // Verify ownership
        if (file.owner.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You don't have access to this file"
            });
        }

        return res.status(200).json({
            success: true,
            message: "File info retrieved successfully",
            file: {
                id: file._id,
                name: file.originalName,
                size: file.size,
                mimeType: file.mimeType,
                uploadedAt: file.uploadedAt,
                updatedAt: file.updatedAt,
                downloadUrl: file.downloadUrl
            }
        });
    } catch (error) {
        console.error("Error in getFileInfo:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve file info"
        });
    }
};

