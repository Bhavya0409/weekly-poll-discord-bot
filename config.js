/**
 * Central configuration file that exports all environment variables
 */
export const CONFIG = {
	BOT_TOKEN: process.env.BOT_TOKEN,
	GUILD_ID: process.env.GUILD_ID,
	ROLE_ID: process.env.ROLE_ID,
	CHANNEL_ID: process.env.CHANNEL_ID,
	POLL_LENGTH_HOURS: parseInt(process.env.POLL_LENGTH_HOURS),
	FOLLOW_UP_PING_HOURS: parseInt(process.env.FOLLOW_UP_PING_HOURS),
};

