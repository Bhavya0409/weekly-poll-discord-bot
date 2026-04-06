import { getFollowingDay } from "./utils.js";

/**
 * If a previous poll is pinned, remove it
 *
 * @param client The discord client object
 */
export const unpinPreviousPoll = async (client) => {
  // Fetch all pinned messages
  const pins = await client.rest.get(
    `/channels/${process.env.CHANNEL_ID}/pins`,
  );

  // Find the last pinned poll
  const lastPinnedPoll = pins.find((pin) => pin.poll);

  // Unpin it if found
  if (lastPinnedPoll) {
    await client.rest.delete(
      `/channels/${process.env.CHANNEL_ID}/pins/${lastPinnedPoll.id}`,
    );
  }
};

/**
 * Send a poll to the channel, and ping the relevant role from the env variable
 *
 * @param client The discord client object
 *
 * @returns {
 *   messageId: The id of the message created,
 *   date: "Month/Date" string format
 * }
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
          duration: parseInt(process.env.POLL_LENGTH_HOURS),
        },
      },
    },
  );
  console.log(`Poll sent for week of ${date}`);
  return { messageId: response.id, date };
};

/**
 * Pin the poll
 *
 * @param {*} client    The discord client object
 * @param {*} messageId The id of the poll message
 */
export const pinPoll = async (client, messageId) => {
  await client.rest.put(
    `/channels/${process.env.CHANNEL_ID}/pins/${messageId}`,
  );
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
 * @param playerIds The ids of the players assigned to the role
 */
export const pingNonVoters = async (client, messageId, playerIds) => {
  const voters = new Set();

  for (let answerId = 1; answerId <= 7; answerId++) {
    const response = await client.rest.get(
      `/channels/${process.env.CHANNEL_ID}/polls/${messageId}/answers/${answerId}`,
    );
    response.users.forEach((user) => voters.add(user.id));
  }

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

/**
 * Send a summary of poll, highlighting the days that work the best for people
 *
 * @param client    The discord client object
 * @param messageId The id of the poll message
 * @param playerIds The ids of the players assigned to the role
 * @param date      The formatted date string
 */
export const sendSummary = async (client, messageId, playerIds, date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const ROSTER_SIZE = 5;
  const answerVotes = {};

  for (let answerId = 1; answerId <= 7; answerId++) {
    const response = await client.rest.get(
      `/channels/${process.env.CHANNEL_ID}/polls/${messageId}/answers/${answerId}`,
    );
    answerVotes[answerId] = response.users;
  }

  let summary = `📊 **Availability Summary — Week of ${date}**\n\n`;

  for (let i = 0; i < days.length; i++) {
    const votes = answerVotes[i + 1];
    const count = votes.length;
    const voterIds = votes.map((u) => u.id);
    const day = days[i];

    if (count === ROSTER_SIZE) {
      summary += `✅ ${day}\n`;
    } else if (count === ROSTER_SIZE - 1) {
      const missingIds = playerIds.filter((id) => !voterIds.includes(id));
      const missingPings = missingIds.map((id) => `<@${id}>`).join(", ");
      summary += `⚠️ ${day} — missing: ${missingPings}\n`;
    } else {
      summary += `❌ ${day}\n`;
    }
  }

  await client.rest.post(`/channels/${process.env.CHANNEL_ID}/messages`, {
    body: { content: summary },
  });
};
