import axios from 'axios';
import FormData from 'form-data';

/**
 * Upload file to Telegram using bot API
 * @param {Stream} fileStream - File stream from multer
 * @param {string} botToken - Telegram bot token
 * @param {string} chatId - Telegram chat ID for storage
 * @param {string} originalFileName - Original filename for reference
 * @returns {Promise<{fileId, filePath, downloadUrl}>}
 */
export const uploadFileToTelegram = async (fileStream, botToken, chatId, originalFileName) => {
    try {
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('document', fileStream, originalFileName);

        // Step 1: Send document to Telegram
        const uploadResponse = await axios.post(
            `https://api.telegram.org/bot${botToken}/sendDocument`,
            form,
            { headers: form.getHeaders() }
        );

        if (!uploadResponse.data.ok) {
            throw new Error('Telegram upload failed: ' + uploadResponse.data.description);
        }

        const fileId = uploadResponse.data.result.document.file_id;

        // Step 2: Get file path from Telegram
        const fileInfoResponse = await axios.get(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
        );

        if (!fileInfoResponse.data.ok) {
            throw new Error('Failed to get file info from Telegram');
        }

        const telegramFilePath = fileInfoResponse.data.result.file_path;

        // Step 3: Generate download URL
        const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${telegramFilePath}`;

        return {
            fileId,
            filePath: telegramFilePath,
            downloadUrl
        };
    } catch (error) {
        console.error('Error uploading file to Telegram:', error.message);
        throw new Error('Failed to upload file to Telegram: ' + error.message);
    }
};

/**
 * Get file info from Telegram
 * @param {string} fileId - Telegram file ID
 * @param {string} botToken - Telegram bot token
 * @returns {Promise<{filePath, downloadUrl}>}
 */
export const getFileFromTelegram = async (fileId, botToken) => {
    try {
        const fileInfoResponse = await axios.get(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
        );

        if (!fileInfoResponse.data.ok) {
            throw new Error('Failed to get file info from Telegram');
        }

        const telegramFilePath = fileInfoResponse.data.result.file_path;
        const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${telegramFilePath}`;

        return {
            filePath: telegramFilePath,
            downloadUrl
        };
    } catch (error) {
        console.error('Error getting file from Telegram:', error.message);
        throw new Error('Failed to get file from Telegram: ' + error.message);
    }
};

/**
 * Delete message (file) from Telegram
 * @param {string} messageId - Telegram message ID containing the file
 * @param {string} botToken - Telegram bot token
 * @param {string} chatId - Telegram chat ID
 * @returns {Promise<boolean>}
 */
export const deleteFileFromTelegram = async (messageId, botToken, chatId) => {
    try {
        const deleteResponse = await axios.post(
            `https://api.telegram.org/bot${botToken}/deleteMessage`,
            {
                chat_id: chatId,
                message_id: messageId
            }
        );

        if (!deleteResponse.data.ok) {
            console.warn('Failed to delete message from Telegram:', deleteResponse.data.description);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error deleting file from Telegram:', error.message);
        return false;
    }
};

/**
 * Download file from Telegram
 * @param {string} downloadUrl - Telegram download URL
 * @returns {Promise<Buffer>}
 */
export const downloadFileFromTelegram = async (downloadUrl) => {
    try {
        const response = await axios.get(downloadUrl, {
            responseType: 'arraybuffer'
        });

        return Buffer.from(response.data);
    } catch (error) {
        console.error('Error downloading file from Telegram:', error.message);
        throw new Error('Failed to download file from Telegram: ' + error.message);
    }
};
