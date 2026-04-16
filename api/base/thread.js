/**
 * Create a thread from a message
 *
 * @param client    Discord client object
 * @param messageId Id of the message to build thread from
 * @param title     Title of thread
 * @returns {Promise<void>}
 */
export const createThread = async (client, messageId, title) => {
	await client.rest.post(
		`/channels/${process.env.SCRIM_CHANNEL_ID}/messages/${messageId}/threads`,
		{
			body: {
				name: title,
				auto_archive_duration: 10080, // 7 days * 24 hours * 60 minutes
			},
		},
	);
}