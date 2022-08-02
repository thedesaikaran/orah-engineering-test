function getFormattedDate(date: Date): string {
  const incomingDateString = new Date(date)
  return incomingDateString.toLocaleString("en-US")
}

export { getFormattedDate }
