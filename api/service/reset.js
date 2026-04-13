import {deletePin, getPins} from "../base/index.js";

/**
 * If there is a previously pinned poll, unpin it
 *
 * @param client Discord client object
 * @returns {Promise<void>}
 */
export const unpinPreviousPoll = async (client) => {
	const pins = await getPins(client)
	const lastPinnedPoll = pins.find((pin) => pin.poll);
	if (lastPinnedPoll) {
		await deletePin(client, lastPinnedPoll.id)
	}
}
/**
 * If there is a previously pinned summary, unpin it
 *
 * @param client Discord client object
 * @returns {Promise<void>}
 */
export const unpinPreviousSummary = async (client) => {
	const pins = await getPins(client)
	const lastPinnedSummary = pins.find(
		(pin) => !pin.poll && pin.content?.startsWith("📊"),
	);
	if (lastPinnedSummary) {
		await deletePin(client, lastPinnedSummary.id)
	}
}