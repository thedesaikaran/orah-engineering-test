const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function getFormattedDate(date: Date): string {
  const incomingDateString = new Date(date)
  return incomingDateString.toLocaleString("en-US")
}

export { getFormattedDate }
