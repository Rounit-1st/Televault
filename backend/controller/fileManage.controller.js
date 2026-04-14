import { User } from "../models/user.model.js";
// import { File } from "../models/entry.model.js";
import { uploadFileToTelegram } from "../services/telegramService.js";

export const _uploadAndSaveFile = async (telegramBotToken, telegramChatId, name, mimetype, size, buffer, id ) => {
    try{
        const {fileId, filePath, downloadUrl, thumbnailUrl} = await uploadFileToTelegram(telegramBotToken, telegramChatId, name, mimetype, size, buffer);
        
    }catch(err){
        console.log("Error uploading file to Telegram:", err);
        return {
            success: false,
            error: "Failed to upload file to Telegram: " + err.message
        }
    }

}


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

export const uploadFile = async(req,res)=>{
    const id = req.id.id;
    console.log()
    const {telegramBotToken, telegramChatId} = req;
    const uploadedFile = req.file;

    try{
            if(!uploadedFile){
            return res.status(400).json({sucess: false, message: "No file provided"})
        }
        const { originalname: name, mimetype, size, buffer } = uploadedFile;
        // console.log("Really lil bro",{ name, mimetype, size, buffer }); 
        const result = await _uploadAndSaveFile(telegramBotToken, telegramChatId, name, mimetype, size, buffer, id);
        try{
            await _cleanupTempPath(uploadFile)
        }catch(cleanErr){
            console.warn("Error during temp file cleanup:", cleanErr.message);  
        }
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error
            });
        }

        return res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            file_id: result.fileId,
            download_url: result.downloadUrl
        });
    }catch(err){
        console.error("Error in uploadFile controller:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while uploading the file"
        });
    }


}