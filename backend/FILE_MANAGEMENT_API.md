/**
 * File Management System Documentation
 * 
 * This file management system uses Telegram Bot API as the storage backend
 * and MongoDB for storing file metadata.
 * 
 * ARCHITECTURE:
 * ============
 * 
 * 1. FILE UPLOAD FLOW:
 *    User -> /upload (multer buffer) -> Telegram API -> MongoDB (metadata) -> Response
 * 
 * 2. FILE DOWNLOAD FLOW:
 *    User -> /download/:id -> MongoDB (metadata) -> Telegram API -> Stream to client
 * 
 * 3. FILE MANAGEMENT:
 *    - Rename: Update metadata in MongoDB only
 *    - Delete: Remove from MongoDB (Telegram deletion optional)
 *    - List: Query MongoDB with pagination
 * 
 * ============================================
 * API ENDPOINTS
 * ============================================
 * 
 * 1. POST /fileManage/upload
 *    Upload a file to Telegram and store metadata
 *    
 *    Headers:
 *      - Content-Type: multipart/form-data
 *      - Cookie: televaultToken=<jwt_token>
 *    
 *    Form Data:
 *      - file: <File object>
 *    
 *    Response (201):
 *    {
 *      success: true,
 *      message: "File uploaded successfully",
 *      file: {
 *        id: "mongodb_id",
 *        name: "filename.ext",
 *        size: 1024,
 *        mimeType: "application/pdf",
 *        uploadedAt: "2024-03-30T...",
 *        downloadUrl: "https://api.telegram.org/file/..."
 *      }
 *    }
 *    
 * ============================================
 * 
 * 2. GET /fileManage/view
 *    Get list of user's files with pagination
 *    
 *    Query Parameters:
 *      - page: Page number (default: 1)
 *      - limit: Items per page (default: 10, max: 100)
 *    
 *    Headers:
 *      - Cookie: televaultToken=<jwt_token>
 *    
 *    Response (200):
 *    {
 *      success: true,
 *      message: "Files retrieved successfully",
 *      pagination: {
 *        currentPage: 1,
 *        totalPages: 5,
 *        totalFiles: 45,
 *        filesPerPage: 10
 *      },
 *      files: [
 *        {
 *          _id: "mongodb_id",
 *          originalName: "document.pdf",
 *          mimeType: "application/pdf",
 *          size: 2048,
 *          uploadedAt: "2024-03-30T...",
 *          downloadUrl: "https://api.telegram.org/file/..."
 *        }
 *      ]
 *    }
 *    
 * ============================================
 * 
 * 3. GET /fileManage/info/:id
 *    Get metadata for a specific file
 *    
 *    Params:
 *      - id: MongoDB file ID
 *    
 *    Headers:
 *      - Cookie: televaultToken=<jwt_token>
 *    
 *    Response (200):
 *    {
 *      success: true,
 *      message: "File info retrieved successfully",
 *      file: {
 *        id: "mongodb_id",
 *        name: "filename.ext",
 *        size: 1024,
 *        mimeType: "application/pdf",
 *        uploadedAt: "2024-03-30T...",
 *        updatedAt: "2024-03-30T...",
 *        downloadUrl: "https://api.telegram.org/file/..."
 *      }
 *    }
 *    
 * ============================================
 * 
 * 4. GET /fileManage/download/:id
 *    Download file directly (streams to client)
 *    
 *    Params:
 *      - id: MongoDB file ID
 *    
 *    Headers:
 *      - Cookie: televaultToken=<jwt_token>
 *    
 *    Response:
 *      - Headers:
 *        Content-Type: <file mime type>
 *        Content-Disposition: attachment; filename="..."
 *      - Body: File stream
 *    
 * ============================================
 * 
 * 5. PUT /fileManage/rename/:id
 *    Rename a file (metadata only, not in Telegram)
 *    
 *    Params:
 *      - id: MongoDB file ID
 *    
 *    Body (JSON):
 *    {
 *      newName: "new_filename.ext"
 *    }
 *    
 *    Headers:
 *      - Content-Type: application/json
 *      - Cookie: televaultToken=<jwt_token>
 *    
 *    Response (200):
 *    {
 *      success: true,
 *      message: "File renamed successfully",
 *      file: {
 *        id: "mongodb_id",
 *        name: "new_filename.ext",
 *        size: 1024,
 *        mimeType: "application/pdf",
 *        uploadedAt: "2024-03-30T...",
 *        updatedAt: "2024-03-30T..."
 *      }
 *    }
 *    
 * ============================================
 * 
 * 6. DELETE /fileManage/delete/:id
 *    Delete file metadata from database
 *    
 *    Params:
 *      - id: MongoDB file ID
 *    
 *    Body (JSON, optional):
 *    {
 *      deleteFromTelegram: false  // Not yet implemented
 *    }
 *    
 *    Headers:
 *      - Content-Type: application/json
 *      - Cookie: televaultToken=<jwt_token>
 *    
 *    Response (200):
 *    {
 *      success: true,
 *      message: "File deleted successfully",
 *      deletedFile: {
 *        id: "mongodb_id",
 *        name: "filename.ext"
 *      }
 *    }
 *    
 * ============================================
 * ERROR HANDLING
 * ============================================
 * 
 * All endpoints follow consistent error responses:
 * 
 * 400 - Bad Request:
 * {
 *   success: false,
 *   message: "Detailed error message"
 * }
 * 
 * 401 - Unauthorized:
 * {
 *   success: false,
 *   message: "Not authorized"
 * }
 * 
 * 403 - Forbidden:
 * {
 *   success: false,
 *   message: "Unauthorized: You don't have access to this file"
 * }
 * 
 * 404 - Not Found:
 * {
 *   success: false,
 *   message: "File not found"
 * }
 * 
 * 500 - Internal Server Error:
 * {
 *   success: false,
 *   message: "Failed to [operation]: error details"
 * }
 * 
 * ============================================
 * SETUP INSTRUCTIONS
 * ============================================
 * 
 * 1. Configure Telegram Bot:
 *    - Create a Telegram bot via BotFather (@BotFather)
 *    - Get bot token: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
 *    - Get a chat ID (send a message to bot, get updates at /getUpdates)
 * 
 * 2. Store in Database:
 *    Update user's telegramApi field with: "botToken:chatId"
 *    Example: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11:987654321"
 * 
 * 3. Middleware Flow:
 *    - protect (auth.middleware.js) - Validates JWT token
 *    - isTelegramApiExistForAccount (tele.api.available.js) - Checks Telegram config
 *    - Route handler
 * 
 * ============================================
 * LIMITATIONS & FUTURE IMPROVEMENTS
 * ============================================
 * 
 * Current Limitations:
 * - Telegram file deletion requires message ID (need to store during upload)
 * - No file encryption (depends on Telegram's security)
 * - No file versioning
 * - No sharing/access control for other users
 * 
 * Future Improvements:
 * - Store Telegram message IDs for file deletion
 * - Implement file versioning
 * - Add file sharing with other users
 * - Add encrypted file names
 * - Implement virus scanning before upload
 * - Add file compression
 * - Rate limiting for uploads
 * - Implement folders/directory structure
 * - Add file search functionality
 * 
 * ============================================
 * DATABASE SCHEMA
 * ============================================
 * 
 * File Collection:
 * {
 *   _id: ObjectId,
 *   originalName: String,
 *   mimeType: String,
 *   size: Number,
 *   telegramFileId: String (unique, indexed),
 *   telegramFilePath: String,
 *   downloadUrl: String,
 *   owner: ObjectId (refs User),
 *   uploadedAt: Date,
 *   updatedAt: Date
 * }
 */

export const FILE_MGMT_DOCS = "See console for documentation";
