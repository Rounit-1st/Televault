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
        const responseData = await response.json();
        console.log("Response:", responseData.result.document.file_id);
        const fileId = responseData.result.document.file_id;
        const thumbnailUrl = responseData.result.document
        console.log(thumbnailUrl)
        const fileInformationResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getFile?file_id=${fileId}`);

        if (!fileInformationResponse.ok) {
            throw new Error(`Telegram API error: ${fileInformationResponse.statusText}`);
        }
        
        const fileInformationData = await fileInformationResponse.json();
        const telegramFilePath = fileInformationData.result.file_path;
        const downloadUrl = `https://api.telegram.org/file/bot${telegramBotToken}/${telegramFilePath}`;
        
        return { fileId, filePath: telegramFilePath, downloadUrl }; 
    }   
    catch(error){
        console.error("Error uploading file to Telegram:", error);
        throw error;
    }   

}