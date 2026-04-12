export const getPins = async (client) => {
	return await client.rest.get(
		`/channels/${process.env.CHANNEL_ID}/pins`,
	);
}
export const deletePin = async (client, messageId) => {
	await client.rest.delete(
		`/channels/${process.env.CHANNEL_ID}/pins/${messageId}`,
	);
}
export const createPin = async (client, messageId) => {
	await client.rest.put(
		`/channels/${process.env.CHANNEL_ID}/pins/${messageId}`,
	);
}