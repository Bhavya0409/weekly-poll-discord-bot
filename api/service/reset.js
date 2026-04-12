import {deletePin, getPins} from "../base/index.js";

export const unpinPreviousPoll = async (client) => {
	const pins = await getPins(client)
	const lastPinnedPoll = pins.find((pin) => pin.poll);
	if (lastPinnedPoll) {
		await deletePin(client, lastPinnedPoll.id)
	}
}
export const unpinPreviousSummary = async (client) => {
	const pins = await getPins(client)
	const lastPinnedSummary = pins.find(
		(pin) => !pin.poll && pin.content?.startsWith("📊"),
	);
	if (lastPinnedSummary) {
		await deletePin(client, lastPinnedSummary.id)
	}
}