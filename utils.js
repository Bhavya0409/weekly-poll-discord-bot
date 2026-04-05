// Given the bot runs on a certain day, return the following day in the format "MM/DD"
export const getFollowingDay = () => {
  const next = new Date();
  next.setDate(next.getDate() + 1);

  const month = String(next.getMonth() + 1).padStart(2, "0");
  const day = String(next.getDate()).padStart(2, "0");

  return `${month}/${day}`;
};
