import {CONFIG} from "../../config.js";
import {createThread, sendMessage} from "../base/index.js";
import {formatDate, getDayName} from "../../utils/dateFns.js";
import {ROSTER_SIZE} from "../../utils/constants.js";

/**
 * Create a new thread for a scrim
 *
 * @param client Discord client object
 * @param date   Date object of date of the scrim
 * @returns {Promise<void>}
 */
const createScrimThread = async (client, date) => {
	const displayDate = formatDate(date)
	const dayName = getDayName(date);
	const title = `(X-X) ${dayName} ${displayDate} - Scrim vs ___`;
	const message = await sendMessage(client, `<@&${CONFIG.ROLE_ID}>`, CONFIG.SCRIM_CHANNEL_ID)
	await createThread(client, message.id, title)
}

/**
 * Create a thread for each day when everyone voted they were available
 *
 * @param client    Discord client object
 * @param responses List of poll responses
 * @param date      Date of the poll
 * @returns {Promise<void>}
 */
export const createScrimThreads = async (client, responses, date) => {
	for (let i = 0; i < 7; i++) {
		if (responses[i].users.length === ROSTER_SIZE) {
			const scrimDate = new Date(date)
			scrimDate.setDate(scrimDate.getDate() + i)
			await createScrimThread(client, scrimDate)
		}
	}
}