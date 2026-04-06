import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

import {
  sendPoll,
  pingNonVoters,
  getPlayerIds,
  sendSummary,
  unpinPreviousPoll,
  unpinPreviousSummary,
  pinMessage,
} from "./discordApi.js";

const CLIENT = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

CLIENT.once("clientReady", async (client) => {
  // Once the client connection has been established, send the poll
  console.log("Established connection. Sending poll...");
  const playerIds = await getPlayerIds(client);

  // Unpin previous poll information
  await unpinPreviousPoll(client);
  await unpinPreviousSummary(client);

  // Send new poll and pin it
  const { messageId, date } = await sendPoll(client);
  await pinMessage(client, messageId);

  // After the poll has been created wait "FOLLOW_UP_PING_HOURS" hours and send a follow up ping to the people that haven't submitted their answers yet.
  setTimeout(
    async () => {
      await pingNonVoters(client, messageId, playerIds);
    },
    5000,
    // parseInt(process.env.FOLLOW_UP_PING_HOURS) * 60 * 60 * 1000,
  );
  setTimeout(
    async () => {
      await unpinPreviousPoll(client);
      const summaryResponseId = await sendSummary(
        client,
        messageId,
        playerIds,
        date,
      );
      await pinMessage(client, summaryResponseId);
      client.destroy();
    },
    10000,
    // parseInt(process.env.POLL_LENGTH_HOURS) * 60 * 60 * 1000,
  );
});

CLIENT.login(process.env.BOT_TOKEN);
