import {CONFIG} from "../../config.js";

/**
 * Send a message to the channel
 *
 * @param client    Discord client object
 * @param message   Message ID
 * @param channelId Channel to post a message
 * @returns {Promise<unknown>}
 */
export const sendMessage = async (client, message, channelId = CONFIG.CHANNEL_ID) => {
	return await client.rest.post(`/channels/${channelId}/messages`, {
		body: {
			content: message,
		},
	});
}