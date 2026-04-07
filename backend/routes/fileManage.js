import { Router } from 'express';
import multer from 'multer';
import { isTelegramApiExistForAccount } from '../middleware/tele.api.available.js';
import {
    uploadFile,
    uploadMultipleFiles,
    viewFiles,
    downloadFile,
    renameFile,
    deleteFile,
    getFileInfo
} from '../controller/FileManage.controller.js';

const fileManageRouter = Router();

// Configure multer to store files in memory (buffer)
const memoryStorage = multer.memoryStorage();
const upload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

/**
 * POST /upload
 * Upload file to Telegram and store metadata
 * @body {File} file - The file to upload
 */
fileManageRouter.post(
    '/upload',
    isTelegramApiExistForAccount,
    upload.single('file'),
    uploadFile
);

/**
 * POST /batch-upload
 * Upload multiple files to Telegram and store metadata
 * Max 10 files per request (sequential processing to avoid rate limits)
 * @body {File[]} files - The files to upload
 * 
 * Response Format:
 * {
 *   success: true,
 *   message: "6 of 8 files uploaded successfully",
 *   summary: {
 *     totalRequested: 8,
 *     successCount: 6,
 *     failureCount: 2
 *   },
 *   files: {
 *     successful: [{ id, name, size, mimeType, uploadedAt, downloadUrl }],
 *     failed: [{ name, error: "reason" }]
 *   }
 * }
 */
fileManageRouter.post(
    '/batch-upload',
    isTelegramApiExistForAccount,
    upload.array('files', 10),
    uploadMultipleFiles
);

/**
 * GET /view
 * Get list of user files with pagination
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 */
fileManageRouter.get(
    '/view',
    isTelegramApiExistForAccount,
    viewFiles
);

/**
 * GET /download/:id
 * Download file to client
 * @params {string} id - File ID in MongoDB
 */
fileManageRouter.get(
    '/download/:id',
    isTelegramApiExistForAccount,
    downloadFile
);

/**
 * GET /info/:id
 * Get file metadata
 * @params {string} id - File ID in MongoDB
 */
fileManageRouter.get(
    '/info/:id',
    isTelegramApiExistForAccount,
    getFileInfo
);

/**
 * PUT /rename/:id
 * Rename file in database
 * @params {string} id - File ID in MongoDB
 * @body {string} newName - New filename
 */
fileManageRouter.put(
    '/rename/:id',
    isTelegramApiExistForAccount,
    renameFile
);

/**
 * DELETE /delete/:id
 * Delete file from database and optionally from Telegram
 * @params {string} id - File ID in MongoDB
 * @body {boolean} deleteFromTelegram - Whether to delete from Telegram (optional)
 */
fileManageRouter.delete(
    '/delete/:id',
    isTelegramApiExistForAccount,
    deleteFile
);

export default fileManageRouter;