import {formatDate, getNextSunday} from "../../utils/dateFns.js";
import {DAYS, ROSTER_SIZE} from "../../utils/constants.js";
import {CONFIG} from "../../config.js";
import {sendMessage} from "../base/message.js";
import {getPlayerIds, getVoters} from "./helpers.js";

/**
 * Send the weekly availability poll
 *
 * @param client Discord client object
 * @returns {Promise<{messageId: *, date: Date}>}
 */
export const sendPoll = async (client) => {
	const date = getNextSunday();
	const displayDate = formatDate(date)
	const response = await client.rest.post(
		`/channels/${CONFIG.CHANNEL_ID}/messages`,
		{
			body: {
				content: `<@&${CONFIG.ROLE_ID}> What is your availability this week?`,
				poll: {
					question: {text: `Availability - Week of ${displayDate}`},
					answers: [
						{poll_media: {text: "Sunday"}},
						{poll_media: {text: "Monday"}},
						{poll_media: {text: "Tuesday"}},
						{poll_media: {text: "Wednesday"}},
						{poll_media: {text: "Thursday"}},
						{poll_media: {text: "Friday"}},
						{poll_media: {text: "Saturday"}},
					],
					allow_multiselect: true,
					duration: CONFIG.POLL_LENGTH_HOURS,
				},
			},
		},
	);
	console.log(`Poll sent for week of ${displayDate}`);
	return {messageId: response.id, date};
}
/**
 * Send a reminder to the users that have the role but didn't vote yet
 *
 * @param client        Discord client object
 * @param pollMessageId Message ID of the poll
 * @returns {Promise<void>}
 */
export const sendReminder = async (client, pollMessageId) => {
	const voters = await getVoters(client, pollMessageId)
	
	if (voters.size !== ROSTER_SIZE) {
		const playerIds = await getPlayerIds(client)
		const nonVoters = playerIds.filter((id) => !voters.has(id));
		const pings = nonVoters.map((id) => `<@${id}>`).join(" ");
		await sendMessage(client, `${pings} Reminder to please fill out the availability poll! 🗓️`)
	}
}
/**
 * Send a summary of the users and answers of the polls
 *
 * @param client    Discord client object
 * @param date      Date of the poll
 * @param responses List of poll responses, each having a list of users that voted for the response
 * @returns {Promise<*>}
 */
export const sendSummary = async (client, date, responses) => {
	const playerIds = await getPlayerIds(client)
	
	let summary = `📊 **Availability Summary — Week of ${formatDate(date)}**\n\n`;
	
	for (let i = 1; i <= DAYS.length; i++) {
		const votes = responses[i - 1].users
		const count = votes.length;
		const voterIds = votes.map((u) => u.id);
		const day = DAYS[i - 1];
		
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
	
	const messageResponse = await sendMessage(client, summary)
	
	return messageResponse.id
}