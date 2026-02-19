import { Router } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import dotenv from 'dotenv'
import uploadSingleFile from '../services/uploadSingleFile.js';

dotenv.config()

const testRouter = Router();

// Temp file storage
const upload = multer({ dest: 'uploads/' });

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

testRouter.post('/', upload.single('file'), async (req, res) => {

    //Temp file created
    try{
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const filePath = req.file.path;

        const form = new FormData();
        form.append("chat_id", CHAT_ID);
        form.append("document", fs.createReadStream(filePath));

        const {downloadUrl,fileId} = await uploadSingleFile(form, BOT_TOKEN)

        fs.unlinkSync(filePath);

        res.status(200).json({
            success: true,
            file_id: fileId,
            download_url: downloadUrl
        });  

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: "Upload failed"
        });
    } 

        // registerEntry();
        
});

export default testRouter;