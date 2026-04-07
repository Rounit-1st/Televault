import { User } from "../models/user.model.js";

const setTelegramApi = async(req,res)=>{
    const id = req.id.id;
    const { telegramBotToken, telegramChatId, telegramChatIds, telegramApi } = req.body;

    if ((!telegramBotToken || (!telegramChatId && !telegramChatIds)) && !telegramApi) {
        return res.status(400).json({success:false,message:"Please provide telegramBotToken + telegramChatId(s) or telegramApi"});
    }

    let update = {};
    let chatIds = [];

    if (telegramBotToken && (telegramChatId || telegramChatIds)) {
        if (telegramChatIds && Array.isArray(telegramChatIds)) {
            chatIds = telegramChatIds.map(id => id.trim()).filter(Boolean);
        } else if (telegramChatId) {
            chatIds = String(telegramChatId).split(',').map(id => id.trim()).filter(Boolean);
        }

        update = {
            telegramBotToken: telegramBotToken.trim(),
            telegramChatIds: chatIds,
            telegramChatId: chatIds[0] || '',
            telegramApi: `${telegramBotToken.trim()}:${chatIds.join(',')}`
        };
    } else if (telegramApi) {
        const parts = telegramApi.split(':');
        if (parts.length < 2) {
            return res.status(400).json({success:false,message:"Invalid telegramApi format. Expected botToken:chatId"});
        }
        const token = parts[0].trim();
        const ch = parts.slice(1).join(':').trim();
        const providedChatIds = ch.includes(',') ? ch.split(',').map(id => id.trim()).filter(Boolean) : [ch];

        chatIds = providedChatIds;

        update = {
            telegramApi: telegramApi.trim(),
            telegramBotToken: token,
            telegramChatIds: chatIds,
            telegramChatId: chatIds[0] || ''
        };
    }

    try{
        await User.findByIdAndUpdate(id, update);
        return res.status(200).json({success:true,message:"telegram api keys successfully added"});
    }catch(err){
        console.error('setTelegramApi error', err);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

const updateTelegramApi = async(req,res)=>{
    const id = req.id.id;
    const { telegramBotToken, telegramChatId, telegramChatIds, telegramApi } = req.body;

    if ((!telegramBotToken || (!telegramChatId && !telegramChatIds)) && !telegramApi) {
        return res.status(400).json({success:false,message:"Please provide telegramBotToken + telegramChatId(s) or telegramApi"});
    }

    let update = {};
    let chatIds = [];

    if (telegramBotToken && (telegramChatId || telegramChatIds)) {
        if (telegramChatIds && Array.isArray(telegramChatIds)) {
            chatIds = telegramChatIds.map(id => id.trim()).filter(Boolean);
        } else if (telegramChatId) {
            chatIds = String(telegramChatId).split(',').map(id => id.trim()).filter(Boolean);
        }

        update = {
            telegramBotToken: telegramBotToken.trim(),
            telegramChatIds: chatIds,
            telegramChatId: chatIds[0] || '',
            telegramApi: `${telegramBotToken.trim()}:${chatIds.join(',')}`
        };
    } else if (telegramApi) {
        const parts = telegramApi.split(':');
        if (parts.length < 2) {
            return res.status(400).json({success:false,message:"Invalid telegramApi format. Expected botToken:chatId"});
        }
        const token = parts[0].trim();
        const ch = parts.slice(1).join(':').trim();
        const providedChatIds = ch.includes(',') ? ch.split(',').map(id => id.trim()).filter(Boolean) : [ch];

        chatIds = providedChatIds;

        update = {
            telegramApi: telegramApi.trim(),
            telegramBotToken: token,
            telegramChatIds: chatIds,
            telegramChatId: chatIds[0] || ''
        };
    }

    try{
        await User.findByIdAndUpdate(id, update);
        return res.status(200).json({success:true,message:"telegram api keys successfully updated"});
    }catch(err){
        console.error('updateTelegramApi error', err);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

const removeTelegramApi = async(req,res)=>{
    const id = req.id.id;
    try{
        await User.findByIdAndUpdate(id, {
            telegramApi: '',
            telegramBotToken: '',
            telegramChatId: '',
            telegramChatIds: []
        }, {new:true});

        return res.status(200).json({success:true,message:"Successfully cleared Api keys"});
    }catch(err){
        console.error('removeTelegramApi error', err);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

const getTelegramApi = async(req,res)=>{
    const id = req.id.id;

    try{
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({ success:false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            telegramApi: userDetails.telegramApi,
            telegramBotToken: userDetails.telegramBotToken,
            telegramChatIds: userDetails.telegramChatIds,
            telegramChatId: userDetails.telegramChatId
        });
    }catch(err){
        console.error('getTelegramApi error', err);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

export {setTelegramApi, updateTelegramApi, removeTelegramApi, getTelegramApi}