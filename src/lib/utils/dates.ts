export const toLocaleDateString = (date: string | Date | null): string => {
  if (!date) {
    return ''
  }
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const toLocaleDate = (date: string | null): Date | null => {
  if (!date) {
    return null
  }
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/
  const match = date.match(regex)
  if (!match) {
    throw new Error(`Invalid date format: ${date}. Expected format is YYYY-MM-DD.`)
  }
  const [_, year, month, day] = match
  return new Date(Number(year), Number(month) - 1, Number(day))
}
