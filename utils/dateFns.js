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
 * Given a JS Date object, return the day name (ex. Monday, Tuesday, etc.)
 *
 * @param date Date object
 * @returns {string}
 */
export const getDayName = (date) => {
	return DAYS[date.getDay()];
}

/**
 * Return the JS Date object of the next day (tomorrow)
 *
 * @returns {Date}
 */
export const getNextDay = () => {
	const next = new Date();
	next.setDate(next.getDate() + 1);
	return next;
}

/**
 * Given a start date, return the end date 7 days later
 *
 * @param startDate Date object
 * @returns {Date}
 */
export const getEndDate = (startDate) => {
	const end = new Date(startDate);
	end.setDate(end.getDate() + 6);
	return end;
}