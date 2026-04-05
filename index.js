import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

import { sendPoll, pingNonVoters } from "./discordApi.js";

const CLIENT = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

CLIENT.once("clientReady", async (client) => {
  // Once the client connection has been established, send the poll
  console.log("Established connection. Sending poll...");
  const messageId = await sendPoll(client);

  // After the poll has been created wait "FOLLOW_UP_PING_HOURS" hours and send a follow up ping to the people that haven't submitted their answers yet.
  setTimeout(
    async () => {
      await pingNonVoters(client, messageId);
      client.destroy();
      console.log("Connection closed.");
    },
    process.env.FOLLOW_UP_PING_HOURS * 60 * 60 * 1000,
  );
});

CLIENT.login(process.env.BOT_TOKEN);
