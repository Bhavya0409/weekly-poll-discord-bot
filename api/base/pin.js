/**
 * Get all pins in the channel
 *
 * @param client  Discord client object
 * @returns {Promise<unknown>}
 */
export const getPins = async (client) => {
	return await client.rest.get(
		`/channels/${process.env.CHANNEL_ID}/pins`,
	);
}
/**
 * Delete a pinned message in the channel
 *
 * @param client    Discord client object
 * @param messageId Message ID
 * @returns {Promise<unknown>}
 */
export const deletePin = async (client, messageId) => {
	await client.rest.delete(
		`/channels/${process.env.CHANNEL_ID}/pins/${messageId}`,
	);
}
/**
 * Pin a message in the channel
 *
 * @param client    Discord client object
 * @param messageId Message ID
 * @returns {Promise<unknown>}
 */
export const createPin = async (client, messageId) => {
	await client.rest.put(
		`/channels/${process.env.CHANNEL_ID}/pins/${messageId}`,
	);
}