// https://discord.com/api/oauth2/authorize?client_id=1006249619556147250&permissions=536939536&scope=bot

const Eris = require("eris");
const botToken = "REDACTED";
const ownerGuildId = "REDACTED";
const webhookBot = new Eris(botToken);

const statuses = ["dytuk.media", "dytuk.media/pay", "llega.top", "drtb.uk"]

webhookBot.on("ready", () => {
    console.log(`Bot connected as ${webhookBot.user.username}`);
    webhookBot.editStatus("playing", { name: statuses[Math.floor(Math.random() * statuses.length)] });
    
    leaveServers();
    setInterval(() => {
        leaveServers();
        webhookBot.editStatus("playing", { name: statuses[Math.floor(Math.random() * statuses.length)] });
    }, 60000 * 5);
});

webhookBot.on("messageCreate", async (msg) => {
    if (msg.content !== 'WEBHOOK') return;

    try {
        const data = await webhookBot.createChannelWebhook(msg.channel.id, { name: "Captain Hook", reason: "thanks for using me", });
        await webhookBot.createMessage(msg.channel.id, `<https://discord.com/api/webhooks/${data.id}/${data.token}>`);
        await webhookBot.createMessage(msg.channel.id, `I'll leave in 5 minutes, or you can kick me... either way, thanks for using me 💖`);
    } catch (error) {
        console.error("Error creating webhook:", error.message);

        try {
            await webhookBot.createMessage(msg.channel.id, "For some reason, I couldn't create the webhook. Can you give me administrator permissions?");
        } catch (innerError) {
            console.error("Error sending message:", innerError.message);
        }
    }
});

webhookBot.on("error", (err) => console.error("Bot encountered an error:", err));

webhookBot.on("disconnect", (err, code) => {
    console.log(`Bot disconnected with code ${code}. Reconnecting in 10 seconds...`);
    setTimeout(() => webhookBot.connect(), 10000);
});

webhookBot.connect(webhookBot.getGateway());

async function leaveServers() {
    for (const [guildID, guild] of webhookBot.guilds) {
        if (guildID !== ownerGuildId && guild.joinedAt instanceof Date && new Date() > guild.joinedAt) {
            try {
                await guild.leave();
                console.log(`Left ${guild.name} - ${guildID}`);
            } catch (error) {
                console.error(`Error leaving ${guild.name} - ${guildID}:`, error.message);
            }
        }
    }
}
