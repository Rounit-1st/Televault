export const uploadFileToTelegram = async (telegramBotToken, telegramChatId, name, mimetype, size, buffer) => {
    try{
        const formData = new FormData();
        formData.append('chat_id', telegramChatId);
        formData.append('document', new Blob([buffer], { type: mimetype }), name);
    
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendDocument`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Telegram API error: ${response.statusText}`);
        }

        const fileId = response.data.result.document.file_id;

        const 
    }   

}