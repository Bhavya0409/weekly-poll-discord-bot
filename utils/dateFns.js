import {DAYS} from "./constants.js";

/**
 * Given a JS Date object, return a formatted date (ex. 04/11)
 *
 * @param date Date object
 * @returns {`${string}/${string}`}
 */
export const formatDate = (date) => {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	
	return `${month}/${day}`;
}
/**
 * Return the JS Date object of the next Sunday
 *
 * @returns {Date}
 */
export const getNextSunday = () => {
	const now = new Date();
	const daysUntilSunday = (DAYS.length - now.getDay()) % DAYS.length || DAYS.length;
	now.setDate(now.getDate() + daysUntilSunday);
	return now;
}