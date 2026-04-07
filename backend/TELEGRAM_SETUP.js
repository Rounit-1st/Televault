/**
 * Example: How to Set Up Telegram API for File Management
 * 
 * This file demonstrates how to configure Telegram Bot API credentials
 */

// ============================================
// STEP 1: Create Telegram Bot
// ============================================
// 
// 1. Open Telegram and search for @BotFather
// 2. Send: /newbot
// 3. Choose a name: e.g., "TelevaultFileBot"
// 4. Choose a username: e.g., "@televault_file_bot"
// 5. You'll receive:
//    "Use this token to access the HTTP API: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
//
// Save this token - this is your BOT_TOKEN
// 
// ============================================
// STEP 2: Get Chat ID
// ============================================
//
// Option A: Private Chat with Bot
// 1. Message your new bot with: /start
// 2. In browser, visit:
//    https://api.telegram.org/bot{BOT_TOKEN}/getUpdates
// 3. Look for "chat": { "id": 987654321, ... }
// 4. Your CHAT_ID is -987654321 (usually negative for groups)
//
// Option B: Use a Private Channel
// 1. Create a private Telegram channel (e.g., @televault_storage)
// 2. Add the bot to the channel as admin
// 3. Send a message in channel
// 4. Get chat ID from /getUpdates
//
// For private channels, prepend "-100" to the ID:
// If ID is 123456789, use: -100123456789
//

// ============================================
// STEP 3: Update User in Database
// ============================================
//
// Format: "botToken:chatId"
// Example: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11:987654321"
//
// In MongoDB, update the user document:
// db.users.updateOne(
//   { email: "user@example.com" },
//   { $set: { telegramApi: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11:987654321" } }
// )
//

// ============================================
// STEP 4: Test Configuration
// ============================================
//
// Run in terminal:
// curl -X GET "https://api.telegram.org/bot{BOT_TOKEN}/getMe"
//
// Should return:
// {
//   "ok": true,
//   "result": {
//     "id": 123456,
//     "is_bot": true,
//     "first_name": "TelevaultFileBot",
//     "username": "televault_file_bot"
//   }
// }
//

// ============================================
// STEP 5: Test Upload
// ============================================
//
// 1. Make sure you're logged in (have valid JWT token)
// 2. Use FormData to send file:
//    POST /fileManage/upload
//    - Form field "file": <your-file>
//    
// 3. Response should include download URL:
//    {
//      "success": true,
//      "message": "File uploaded successfully",
//      "file": {
//        "id": "507f1f77bcf86cd799439011",
//        "name": "document.pdf",
//        "downloadUrl": "https://api.telegram.org/file/..."
//      }
//    }
//

// ============================================
// SECURITY CONSIDERATIONS
// ============================================
//
// 1. NEVER hardcode bot token in client code
// 2. Store BOT_TOKEN in .env file:
//    TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl...
//    TELEGRAM_CHAT_ID=987654321
//
// 3. Use environment variables in production
// 4. Rotate tokens if compromised
// 5. Limit bot permissions:
//    - Only allow sending documents
//    - Restrict deletion to admin only
//    - Use private channels for storage
//
// 6. Validate file types and sizes:
//    - Max upload size: 50MB (configured in multer)
//    - Implement file type whitelist
//    - Scan for malware before/after upload
//

// ============================================
// EXAMPLE: Update User Telegram API
// ============================================
//
// JavaScript/Node.js:
/*
const User = require('./models/user.model');

async function setupTelegramForUser(userId, botToken, chatId) {
  const telegramApi = `${botToken}:${chatId}`;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { telegramApi },
    { new: true }
  );
  
  console.log('Telegram API updated for user:', user.email);
  return user;
}

// Usage:
// await setupTelegramForUser(
//   "507f1f77bcf86cd799439011",
//   "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
//   "987654321"
// );
*/
//

// ============================================
// EXAMPLE: API Usage from Frontend
// ============================================
//
// 1. Upload File:
/*
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/fileManage/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include'  // Include cookies for auth
});

const data = await response.json();
console.log('File ID:', data.file.id);
console.log('Download URL:', data.file.downloadUrl);
*/
//
// 2. View Files:
/*
const response = await fetch('/fileManage/view?page=1&limit=10', {
  method: 'GET',
  credentials: 'include'
});

const data = await response.json();
console.log('Total files:', data.pagination.totalFiles);
console.log('Files:', data.files);
*/
//
// 3. Download File:
/*
const fileId = "507f1f77bcf86cd799439011";
window.location.href = `/fileManage/download/${fileId}`;
*/
//
// 4. Rename File:
/*
const fileId = "507f1f77bcf86cd799439011";
const response = await fetch(`/fileManage/rename/${fileId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ newName: 'new-filename.pdf' }),
  credentials: 'include'
});
*/
//
// 5. Delete File:
/*
const fileId = "507f1f77bcf86cd799439011";
const response = await fetch(`/fileManage/delete/${fileId}`, {
  method: 'DELETE',
  credentials: 'include'
});
*/
//

// ============================================
// TROUBLESHOOTING
// ============================================
//
// Problem: "telegram api is empty"
// Solution: Make sure to set telegramApi field in database
//
// Problem: "No file provided"
// Solution: Send file with form field name "file"
//
// Problem: "Failed to upload file to Telegram"
// Solution: 
//   - Check bot token is correct
//   - Check chat ID is correct
//   - Bot must be admin in private channel
//   - Bot must have permission to post documents
//
// Problem: "File not found"
// Solution: Check if file ID is correct and belongs to current user
//
// Problem: Download returns 404
// Solution: Telegram download URL may have expired. Use /view to get fresh URLs
//

export default {
  BOT_TOKEN_EXAMPLE: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  CHAT_ID_EXAMPLE: "987654321",
  TELEGRAM_API_FORMAT: "botToken:chatId"
};
