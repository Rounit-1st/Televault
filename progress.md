✅ Week 1: MVP (Core Functional Prototype)
🎯 Goal: Build a working system where a user can upload a file, it gets encrypted, sent to Telegram, and retrieved by username + password.
📅 Day 1–2: Project Setup & Upload UI
Set up project with React (Vite) + Tailwind for frontend.

Set up Node.js + Express backend.

Build simple upload UI with file picker and password field.

Use axios to POST file and password to backend.

📅 Day 3–4: Encryption + Telegram Integration
Use crypto in Node.js to:

Encrypt file with AES (password → key)

Store encrypted file temporarily

Use Telegram Bot API (node-telegram-bot-api) to:

Send encrypted file to a private channel (or bot storage)

Save Telegram file_id and user's Telegram username (in memory or DB)

📅 Day 5–6: Retrieval UI + Decryption
Create a retrieve page:

Input: username + password

Backend:

Find Telegram file_id via username

Fetch file from Telegram (getFile)

Decrypt using password

Serve decrypted file to download

📅 Day 7: Test, Polish, Deploy MVP
Add loading indicators and error handling.

Test with image/pdf/zip files under 25MB.

Use Render, Vercel, or Railway to deploy backend.

Deploy frontend with Netlify or Vercel.

✨ Week 2 (Optional Polish & “Make it Sick”)
🎨 Goal: Make it portfolio-worthy and polished.
📅 Day 1–2: UI Polish
Add drag-and-drop upload (react-dropzone)

Display thumbnails/icons

Add animations (Framer Motion)

📅 Day 3–4: Security & UX Enhancements
Show password strength or hint

One-time download link (generate UUID)

Add file expiry (auto-delete from memory after 24h)

Prevent large file upload

📅 Day 5–6: Extras / Bonus
Save metadata to MongoDB (username, filename, timestamp)

Create a dashboard view

QR code generator for retrieve link

📅 Day 7: Final Testing + README + Demo
Record demo video

Write clear README.md:

Features

Tech stack

How to run

Add screenshots or screen recording (Loom, OBS)

Push to GitHub