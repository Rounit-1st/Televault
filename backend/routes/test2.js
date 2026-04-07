const telegram_token = process.env.TELEGRAM_BOT_TOKEN
import axios from "axios";

const some = await axios.get(
        `https://api.telegram.org/bot${telegram_token}/getUpdates`
);
console.log("really lil bro")
