export const getTelegramGroupId = async (botToken) => {
    try {
        // Step 1: Validate bot token + fetch updates
        const response = await fetch(
            `https://api.telegram.org/bot${botToken}/getUpdates`
        );

        const data = await response.json();

        if (!data.ok) {
            return {
                success: false,
                message: "Invalid Bot Token"
            };
        }

        // Step 2: Find first group or supergroup
        for (const update of data.result) {
            // Normal message updates
            if (
                update.message &&
                update.message.chat &&
                (update.message.chat.type === "group" ||
                 update.message.chat.type === "supergroup")
            ) {
                return {
                    success: true,
                    groupId: update.message.chat.id,
                    groupName: update.message.chat.title || "Unnamed Group"
                };
            }

            // Bot added/removed updates
            if (
                update.my_chat_member &&
                update.my_chat_member.chat &&
                (update.my_chat_member.chat.type === "group" ||
                 update.my_chat_member.chat.type === "supergroup")
            ) {
                return {
                    success: true,
                    groupId: update.my_chat_member.chat.id,
                    groupName: update.my_chat_member.chat.title || "Unnamed Group"
                };
            }
        }

        return {
            success: false,
            message:
                "No group found. Please create a group, add the bot, and send a message."
        };
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong"
        };
    }
};

async function main(){
const groupid = await getTelegramGroupId("7973392671:AAHlP05GGGJ8Pu4EYvBiGzqA0LJTqh9ho64");
console.log(groupid.groupId);
}
main();