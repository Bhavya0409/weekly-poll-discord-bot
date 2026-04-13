/**
 * Send a message to the channel
 *
 * @param client  Discord client object
 * @param message Message ID
 * @returns {Promise<unknown>}
 */
export const sendMessage = async (client, message) => {
	return await client.rest.post(`/channels/${process.env.CHANNEL_ID}/messages`, {
		body: {
			content: message,
		},
	});
}