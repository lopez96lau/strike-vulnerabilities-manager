export const parseDate = (dateString: string) => {
  const dateObject = new Date(dateString);
  const date = dateObject.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return date;
};
