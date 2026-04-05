import { getFollowingDay } from "./utils.js";

/**
 * Send a poll to the channel, and ping the relevant role from the env variable
 *
 * @param client The discord client object
 *
 * @returns The id of the message created
 */
export const sendPoll = async (client) => {
  const date = getFollowingDay();
  const response = await client.rest.post(
    `/channels/${process.env.CHANNEL_ID}/messages`,
    {
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
    },
  );
  console.log(`Poll sent for week of ${date}`);
  return response.id;
};

/**
 *
 * Get a list of player IDs associated with the relevent role from the env variable
 *
 * @param client The discord client object
 *
 * @returns The list of player ids
 */
export const getPlayerIds = async (client) => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  await guild.members.fetch(); // force fetches all members into cache
  const role = await guild.roles.fetch(process.env.ROLE_ID);
  return role.members.map((member) => member.id);
};

/**
 * @param client    The discord client object
 * @param messageId The id of the poll message
 */
export const pingNonVoters = async (client, messageId) => {
  const voters = new Set();

  for (let answerId = 1; answerId <= 7; answerId++) {
    const response = await client.rest.get(
      `/channels/${process.env.CHANNEL_ID}/polls/${messageId}/answers/${answerId}`,
    );
    response.users.forEach((user) => voters.add(user.id));
  }

  const playerIds = await getPlayerIds(client);

  const nonVoters = playerIds.filter((id) => !voters.has(id));

  if (nonVoters.length > 0) {
    const pings = nonVoters.map((id) => `<@${id}>`).join(" ");
    await client.rest.post(`/channels/${process.env.CHANNEL_ID}/messages`, {
      body: {
        content: `${pings} Reminder to please fill out the availability poll! 🗓️`,
      },
    });
  }
};
