export const sendMessage = async (client, message) => {
	return await client.rest.post(`/channels/${process.env.CHANNEL_ID}/messages`, {
		body: {
			content: message,
		},
	});
}