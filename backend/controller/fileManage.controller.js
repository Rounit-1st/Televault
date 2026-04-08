import { User } from "../models/user.model.js";

export const _uploadAndSaveFile = async (telegramBotToken, telegramChatId, name, mimetype, size, buffer, telegramBotToken, telegramChatId, UserId ) => {
    try{
        const {fileId, filePath, downloadUrl} = await uploadFileToTelegram(telegramBotToken, telegramChatId, name, mimetype, size, buffer);
    }
}

export const uploadFile = async(req,res)=>{
    const id = req.id.id;
    const {telegramBotToken, telegramChatId} = req;
    const uploadedFile = req.file;

    if(!uploadedFile){
        return res.status(400).json({sucess: false, message: "No file provided"})
    }
    const { originalname: name, mimetype, size, buffer } = uploadedFile;
    console.log("Really lil bro",{ name, mimetype, size, buffer });
    const result = await _uploadAndSaveFile(telegramBotToken, telegramChatId, name, mimetype, size, buffer, telegramBotToken, telegramChatId, id);
}