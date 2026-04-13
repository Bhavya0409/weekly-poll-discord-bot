import {DAYS} from "../../utils/constants.js";

/**
 * Get all the player ids that have the role
 *
 * @param client Discord client object
 * @returns {Promise<[]>}
 */
export const getPlayerIds = async (client) => {
	const guild = await client.guilds.fetch(process.env.GUILD_ID);
	await guild.members.fetch(); // force fetches all members into cache
	const role = await guild.roles.fetch(process.env.ROLE_ID);
	return role.members.map((member) => member.id);
}
/**
 * Get a list of responses to the poll
 *
 * @param client        Discord client object
 * @param pollMessageId Message ID of the poll
 * @returns {Promise<*[]>}
 */
export const getResponses = async (client, pollMessageId) => {
	const responses = []
	for (let answerId = 1; answerId <= DAYS.length; answerId++) {
		const response = await client.rest.get(
			`/channels/${process.env.CHANNEL_ID}/polls/${pollMessageId}/answers/${answerId}`,
		);
		responses.push(response)
	}
	return responses
}
/**
 * Get a set of users that voted in the poll
 *
 * @param client        Discord client object
 * @param pollMessageId Message ID of the poll
 * @returns {Promise<Set<any>>}
 */
export const getVoters = async (client, pollMessageId) => {
	const responses = await getResponses(client, pollMessageId)
	
	const voters = new Set();
	responses.forEach((response) => {
		response.users.forEach((user) => voters.add(user.id))
	})
	
	return voters
}