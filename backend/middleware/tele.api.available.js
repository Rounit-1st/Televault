import { getUserInfo } from "../services/getUseInfo.js"

/**
 * Middleware to check if user has Telegram API configured
 * Attaches telegramBotToken and telegramChatId to req object
 */
export const isTelegramApiExistForAccount = async (req, res, next) => {
    try {
        const userId = req.id.id;
        const userDetails = await getUserInfo(userId);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let botToken = '';
        let chatId = '';

        if (userDetails.telegramBotToken?.trim()) {
            botToken = userDetails.telegramBotToken.trim();
        }

        const mevChatIds = Array.isArray(userDetails.telegramChatIds) ? userDetails.telegramChatIds.filter(Boolean).map(id=>id.trim()) : [];

        if (mevChatIds.length > 0) {
            // simple round-robin based on milliseconds to spread across IDs
            const index = Math.floor(Date.now() / 1000) % mevChatIds.length;
            chatId = mevChatIds[index];
            req._availableTelegramChatIds = mevChatIds;
        } else if (userDetails.telegramChatId?.trim()) {
            chatId = userDetails.telegramChatId.trim();
        } else if (userDetails.telegramApi?.trim()) {
            const parts = userDetails.telegramApi.split(':');
            if (parts.length >= 2) {
                botToken = botToken || parts[0].trim();
                chatId = (parts.slice(1).join(':') || '').trim();
            }
        }

        if (!botToken || !chatId) {
            return res.status(400).json({
                success: false,
                message: "Telegram Bot API not configured for your account. Please set bot token + chat ids via /telegramApiManage."
            });
        }

        req.telegramBotToken = botToken;
        req.telegramChatId = chatId; // selected one
        req.userId = userId;

        next();
    } catch (error) {
        console.error('Error in isTelegramApiExistForAccount middleware:', error);
        return res.status(500).json({
            success: false,
            message: "Error checking Telegram API configuration"
        });
    }
};