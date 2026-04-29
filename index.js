import "dotenv/config";
import {Client, Events, GatewayIntentBits} from "discord.js";

import {CONFIG} from "./config.js";
import {
	getResponses,
	sendPoll,
	sendReminder,
	sendSummary,
	unpinPreviousPoll,
	unpinPreviousSummary,
	createScrimThreads
} from "./api/service/index.js";
import {createPin} from "./api/base/index.js";

const CLIENT = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

CLIENT.once(Events.ClientReady, async (client) => {
	// Once the client connection has been established, send the poll
	console.log("Established connection. Sending poll...");
	
	// First, unpin the previous existing summary. Then, send a new poll. Finally, pin the newly created poll.
	await unpinPreviousSummary(client);
	const {messageId, date} = await sendPoll(client);
	await createPin(client, messageId);
	
	// After the poll has been created, wait "FOLLOW_UP_PING_HOURS" hours and send a follow up ping to the people that haven't submitted their answers yet.
	setTimeout(
		async () => {
			await sendReminder(client, messageId);
		},
		CONFIG.FOLLOW_UP_PING_HOURS * 60 * 60 * 1000,
	);
	setTimeout(
		async () => {
			await unpinPreviousPoll(client);
			const responses = await getResponses(client, messageId)
			const summaryResponseId = await sendSummary(
				client,
				date,
				responses
			);
			await createPin(client, summaryResponseId);
			await createScrimThreads(client, responses, date)
			await client.destroy();
		},
		CONFIG.POLL_LENGTH_HOURS * 60 * 60 * 1000,
	);
});

CLIENT.login(CONFIG.BOT_TOKEN).then(() => console.log('Logged in to discord'));
