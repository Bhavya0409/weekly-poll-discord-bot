import {CONFIG} from "../../config.js";

/**
 * Get all pins in the channel
 *
 * @param client  Discord client object
 * @returns {Promise<unknown>}
 */
export const getPins = async (client) => {
	return await client.rest.get(
		`/channels/${CONFIG.CHANNEL_ID}/pins`,
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
		`/channels/${CONFIG.CHANNEL_ID}/pins/${messageId}`,
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
		`/channels/${CONFIG.CHANNEL_ID}/pins/${messageId}`,
	);
}