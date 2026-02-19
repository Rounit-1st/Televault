import axios from "axios";

const uploadSingleFile = async(form, BOT_TOKEN)=>{
    
    
    // Step 1: Upload Document to Telegram
    const uploadResponse = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        form,
        { headers: form.getHeaders() }
    );

    console.log("lol",uploadResponse)
    const fileId = uploadResponse.data.result.document.file_id;

    // Step 2: Get file path from Telegram
    const fileInfo = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    console.log(fileInfo.data)
    const telegramFilePath = fileInfo.data.result.file_path;

    // Step 3: Generate download URL
    const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${telegramFilePath}`;
    
    return {downloadUrl,fileId}
}

export default uploadSingleFile;