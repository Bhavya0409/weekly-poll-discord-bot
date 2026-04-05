import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const getFollowingDay = () => {
  const next = new Date();
  next.setDate(next.getDate() + 1);

  const month = String(next.getMonth() + 1).padStart(2, "0");
  const day = String(next.getDate()).padStart(2, "0");

  return `${month}/${day}`;
};

client.once("ready", async () => {
  console.log("Established connection. Sending poll...");
  const date = getFollowingDay();

  await client.rest.post(`/channels/${process.env.CHANNEL_ID}/messages`, {
    body: {
      content: `<@&${process.env.ROLE_ID}> What is your availability this week?`,
      poll: {
        question: { text: `Availability - Week of ${date}` },
        answers: [
          { poll_media: { text: "Sunday" } },
          { poll_media: { text: "Monday" } },
          { poll_media: { text: "Tuesday" } },
          { poll_media: { text: "Wednesday" } },
          { poll_media: { text: "Thursday" } },
          { poll_media: { text: "Friday" } },
          { poll_media: { text: "Saturday" } },
        ],
        allow_multiselect: true,
        duration: 24,
      },
    },
  });

  console.log(`Poll sent for week of ${date}`);

  client.destroy();
  console.log("Poll sent. Connection closed.");
});

client.login(process.env.BOT_TOKEN);
