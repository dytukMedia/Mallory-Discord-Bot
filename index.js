import Eris from 'eris';
import { schedule } from 'node-cron';

const webhookBot = new Eris(process.env.DISCORD_TOKEN);

// https://discord.com/api/oauth2/authorize?client_id=1006249619556147250&permissions=536939536&scope=bot

webhookBot.on("ready", () => {
    console.log("Mallory is Ready!");
    webhookBot.editStatus('dnd', { name: 'danielytuk', type: 3 })
    leaveServers();
    schedule('*/5 * * * *', () => leaveServers());
});

webhookBot.on("messageCreate", async msg => {
    if (!msg.content.includes('1006249619556147250') || msg.author.id === "1006249619556147250") return;

    try {
        const data = await webhookBot.createChannelWebhook(msg.channel.id, { name: "Captain Hook", reason: "thanks for using me" });
        await webhookBot.createMessage(msg.channel.id, `<https://discord.com/api/webhooks/${data.id}/${data.token}>`);
        await webhookBot.createMessage(msg.channel.id, `I'll leave in 5 minutes, or you can kick me... either way, thanks for using me ðŸ’–\n*Please consider subscribing if this helped you: <https://youtube.com/danielytuk>*`);
    } catch (error) {
        console.log(error)
        await webhookBot.createMessage(msg.channel.id, `Oh No! Something went wrong. Daniel has been notified.`);
        await webhookBot.createMessage('1097525518162726913', `<@517073424510746644> There was an error!\nServer: ${msg.guild.name} (${msg.guild.id})\n\n${error.message}`);
    }
});

webhookBot.connect();

function leaveServers() {
    webhookBot.guilds.map(g => g.id !== '782590363533312050' && new Date() > g.joinedAt && (g.leave(), console.log(`Left Server: ${g.name} (${g.id})`)));
}