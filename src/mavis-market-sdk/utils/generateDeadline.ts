export const generateDeadline = () => {
  return parseInt(`${new Date().getTime() / 1000 + 30 * 60}`).toString();
};
