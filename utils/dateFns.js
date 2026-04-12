import {DAYS} from "./constants.js";

export const formatDate = (date) => {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${month}/${day}`;
}
export const getNextSunday = () => {
	const now = new Date();
	const daysUntilSunday = (DAYS.length - now.getDay()) % DAYS.length || DAYS.length;
	now.setDate(now.getDate() + daysUntilSunday);
	return formatDate(now);
}