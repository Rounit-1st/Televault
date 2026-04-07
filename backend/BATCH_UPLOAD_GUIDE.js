/**
 * BATCH UPLOAD API - Quick Reference Guide
 * 
 * Upload multiple files in a single request with error handling
 */

// ============================================
// ENDPOINT: POST /fileManage/batch-upload
// ============================================
/*
Upload multiple files (max 10) to Telegram and store metadata

LIMITS:
  - Max 10 files per request
  - 50MB per file (enforced by multer)
  - Sequential processing (avoids Telegram rate limits)

REQUEST HEADERS:
  - Content-Type: multipart/form-data
  - Cookie: televaultToken=<jwt_token>

REQUEST BODY:
  - Form field "files" with multiple file inputs

CURL EXAMPLE:
curl -X POST http://localhost:3000/fileManage/batch-upload \
  -F "files=@document1.pdf" \
  -F "files=@document2.docx" \
  -F "files=@image.png" \
  -b cookies.txt

SUCCESS RESPONSE (201):
{
  "success": true,
  "message": "3 of 3 files uploaded successfully",
  "summary": {
    "totalRequested": 3,
    "successCount": 3,
    "failureCount": 0
  },
  "files": {
    "successful": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "document1.pdf",
        "size": 2048,
        "mimeType": "application/pdf",
        "uploadedAt": "2024-03-30T12:00:00.000Z",
        "downloadUrl": "https://api.telegram.org/file/bot..."
      },
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "document2.docx",
        "size": 3072,
        "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "uploadedAt": "2024-03-30T12:00:01.000Z",
        "downloadUrl": "https://api.telegram.org/file/bot..."
      },
      {
        "id": "507f1f77bcf86cd799439013",
        "name": "image.png",
        "size": 1500,
        "mimeType": "image/png",
        "uploadedAt": "2024-03-30T12:00:02.000Z",
        "downloadUrl": "https://api.telegram.org/file/bot..."
      }
    ],
    "failed": []
  }
}

PARTIAL FAILURE RESPONSE (201 - still succeeds if at least 1 uploaded):
{
  "success": true,
  "message": "2 of 3 files uploaded successfully",
  "summary": {
    "totalRequested": 3,
    "successCount": 2,
    "failureCount": 1
  },
  "files": {
    "successful": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "document1.pdf",
        "size": 2048,
        "mimeType": "application/pdf",
        "uploadedAt": "2024-03-30T12:00:00.000Z",
        "downloadUrl": "https://api.telegram.org/file/bot..."
      },
      {
        "id": "507f1f77bcf86cd799439013",
        "name": "image.png",
        "size": 1500,
        "mimeType": "image/png",
        "uploadedAt": "2024-03-30T12:00:02.000Z",
        "downloadUrl": "https://api.telegram.org/file/bot..."
      }
    ],
    "failed": [
      {
        "name": "document2.docx",
        "error": "Failed to upload file to Telegram: API error"
      }
    ]
  }
}

ALL FAILURES RESPONSE (400 - no files uploaded):
{
  "success": false,
  "message": "0 of 3 files uploaded successfully",
  "summary": {
    "totalRequested": 3,
    "successCount": 0,
    "failureCount": 3
  },
  "files": {
    "successful": [],
    "failed": [
      {
        "name": "document1.pdf",
        "error": "..."
      },
      {
        "name": "document2.docx",
        "error": "..."
      },
      {
        "name": "image.png",
        "error": "..."
      }
    ]
  }
}

ERROR RESPONSES:

400 - No files provided:
{
  "success": false,
  "message": "No files provided"
}

400 - Too many files (>10):
{
  "success": false,
  "message": "Maximum 10 files per batch (received 15). Please use multiple requests."
}

400 - Telegram API not configured:
{
  "success": false,
  "message": "Telegram Bot API not configured for your account. Please set up your Telegram API first."
}

401 - Not authenticated:
{
  "success": false,
  "message": "Not authorized"
}

500 - Server error:
{
  "success": false,
  "message": "Failed to process batch upload: error details"
}
*/

// ============================================
// FRONTEND EXAMPLES
// ============================================

// ---- VANILLA JAVASCRIPT ----
/*
// HTML:
<form id="batchForm">
  <input type="file" name="files" multiple accept=".pdf,.doc,.docx,.txt">
  <button type="submit">Upload Multiple Files</button>
  <div id="results"></div>
</form>

// JavaScript:
document.getElementById('batchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  const fileInputs = document.querySelector('input[name="files"]').files;
  
  // Add all files to FormData
  for (let i = 0; i < fileInputs.length; i++) {
    formData.append('files', fileInputs[i]);
  }
  
  try {
    const response = await fetch('/fileManage/batch-upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    const data = await response.json();
    
    const resultsDiv = document.getElementById('results');
    
    // Show successful uploads
    if (data.files.successful.length > 0) {
      const successList = data.files.successful
        .map(f => `<li>${f.name} (${(f.size / 1024).toFixed(2)} KB)</li>`)
        .join('');
      resultsDiv.innerHTML += `<h3>Uploaded Successfully:</h3><ul>${successList}</ul>`;
    }
    
    // Show failed uploads
    if (data.files.failed.length > 0) {
      const failedList = data.files.failed
        .map(f => `<li>${f.name}: ${f.error}</li>`)
        .join('');
      resultsDiv.innerHTML += `<h3>Failed:</h3><ul>${failedList}</ul>`;
    }
    
    console.log('Upload complete:', data);
  } catch (error) {
    console.error('Upload error:', error);
  }
});
*/

// ---- REACT EXAMPLE ----
/*
import { useState } from 'react';

function BatchUpload() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);
  
  const handleUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    try {
      const response = await fetch('/fileManage/batch-upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Upload error:', error);
      setResults({
        success: false,
        message: 'Upload failed: ' + error.message
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleUpload}
        disabled={uploading}
      />
      
      {uploading && <p>Uploading...</p>}
      
      {results && (
        <div>
          <p>{results.message}</p>
          
          {results.files?.successful?.length > 0 && (
            <div>
              <h3>Successfully Uploaded ({results.summary.successCount})</h3>
              <ul>
                {results.files.successful.map(f => (
                  <li key={f.id}>
                    {f.name} - {(f.size / 1024).toFixed(2)} KB
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {results.files?.failed?.length > 0 && (
            <div>
              <h3>Failed ({results.summary.failureCount})</h3>
              <ul>
                {results.files.failed.map((f, i) => (
                  <li key={i}>
                    {f.name}: {f.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
*/

// ============================================
// TESTING WITH CURL
// ============================================
/*
# Test 1: Successful upload of 3 files
curl -X POST http://localhost:3000/fileManage/batch-upload \
  -F "files=@test1.pdf" \
  -F "files=@test2.txt" \
  -F "files=@test3.png" \
  -b cookies.txt

# Test 2: Too many files (should fail)
curl -X POST http://localhost:3000/fileManage/batch-upload \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf" \
  ... (11+ files)
  -b cookies.txt
# Expected: 400 "Maximum 10 files per batch"

# Test 3: No files provided
curl -X POST http://localhost:3000/fileManage/batch-upload \
  -b cookies.txt
# Expected: 400 "No files provided"

# Test 4: Without auth token
curl -X POST http://localhost:3000/fileManage/batch-upload \
  -F "files=@test.pdf"
# Expected: 401 "Not authorized"

# Test 5: User without Telegram configured
curl -X POST http://localhost:3000/fileManage/batch-upload \
  -F "files=@test.pdf" \
  -b cookies.txt
# Expected: 400 "Telegram Bot API not configured"
*/

// ============================================
// HOW IT WORKS (ARCHITECTURE)
// ============================================
/*
1. CLIENT SENDS REQUEST
   POST /batch-upload with FormData containing multiple files

2. MULTER PROCESSES
   - upload.array('files', 10) limits to 10 files
   - Stores each file in memory (buffer)

3. MIDDLEWARE RUNS
   - protect: Validates JWT token
   - isTelegramApiExistForAccount: Extracts bot token & chat ID

4. CONTROLLER PROCESSES
   - uploadMultipleFiles() handler:
     a. Validates file count
     b. Loops through each file sequentially
     c. Calls shared helper _uploadAndSaveFile() for each
     d. Catches errors per file (doesn't stop processing)
     e. Collects successful & failed results

5. FOR EACH FILE:
   - _uploadAndSaveFile() helper:
     a. Uploads to Telegram (gets file_id)
     b. Creates File document in MongoDB
     c. Saves and returns metadata
     d. On error, returns error details (but doesn't throw)

6. CLIENT GETS RESPONSE
   - 201 if ≥1 file uploaded
   - 400 if 0 files uploaded
   - Includes summary + detailed results
*/

// ============================================
// ADVANTAGES VS SINGLE UPLOAD
// ============================================
/*
SINGLE UPLOAD (/upload):
+ Simple, focused API
+ Lightweight requests
+ Fast for occasional uploads
- Need multiple requests for many files
- No partial success handling

BATCH UPLOAD (/batch-upload):
+ Upload many files at once
+ Detailed error reporting per file
+ Partial success support
+ Good for folder sync or bulk operations
+ Better user experience for mass uploads
- Slightly heavier payload
- Longer request duration
- Limited to 10 files per request
*/

export const BATCH_UPLOAD_DOCS = "See comments for full documentation";
