import {formatDate, getNextDay, getEndDate, getDayName} from "../../utils/dateFns.js";
import {ROSTER_SIZE} from "../../utils/constants.js";
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
	const startDate = getNextDay();
	const endDate = getEndDate(startDate);
	const startDisplayDate = formatDate(startDate);
	const endDisplayDate = formatDate(endDate);
	
	// Generate poll answers dynamically for the next 7 days
	const answers = [];
	for (let i = 0; i < 7; i++) {
		const date = new Date(startDate);
		date.setDate(date.getDate() + i);
		const dayName = getDayName(date);
		const displayDate = formatDate(date);
		answers.push({poll_media: {text: `${dayName} ${displayDate}`}});
	}
	
	const response = await client.rest.post(
		`/channels/${CONFIG.CHANNEL_ID}/messages`,
		{
			body: {
				content: `<@&${CONFIG.ROLE_ID}> What is your availability this week?`,
				poll: {
					question: {text: `Availability - Week of ${startDisplayDate} to ${endDisplayDate}`},
					answers: answers,
					allow_multiselect: true,
					duration: CONFIG.POLL_LENGTH_HOURS,
				},
			},
		},
	);
	console.log(`Poll sent for week of ${startDisplayDate} to ${endDisplayDate}`);
	return {messageId: response.id, date: startDate};
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
 * @param date      Date of the poll (start date)
 * @param responses List of poll responses, each having a list of users that voted for the response
 * @returns {Promise<*>}
 */
export const sendSummary = async (client, date, responses) => {
	const playerIds = await getPlayerIds(client)
	const endDate = getEndDate(date);
	
	let summary = `📊 **Availability Summary — Week of ${formatDate(date)} to ${formatDate(endDate)}**\n\n`;
	
	for (let i = 0; i < 7; i++) {
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() + i);
		const dayName = getDayName(currentDate);
		const displayDate = formatDate(currentDate);
		
		const votes = responses[i].users
		const count = votes.length;
		const voterIds = votes.map((u) => u.id);
		
		if (count === ROSTER_SIZE) {
			summary += `✅ ${dayName} ${displayDate}\n`;
		} else if (count === ROSTER_SIZE - 1) {
			const missingIds = playerIds.filter((id) => !voterIds.includes(id));
			const missingPings = missingIds.map((id) => `<@${id}>`).join(", ");
			summary += `⚠️ ${dayName} ${displayDate} — missing: ${missingPings}\n`;
		} else {
			summary += `❌ ${dayName} ${displayDate}\n`;
		}
	}
	
	const messageResponse = await sendMessage(client, summary)
	
	return messageResponse.id
}