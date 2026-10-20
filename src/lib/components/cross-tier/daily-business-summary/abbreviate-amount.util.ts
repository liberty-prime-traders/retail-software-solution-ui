const THRESHOLDS: {limit: number, suffix: string}[] = [
  {limit: 1_000_000_000, suffix: 'B'},
  {limit: 1_000_000, suffix: 'M'},
  {limit: 1_000, suffix: 'k'}
]

export const abbreviateAmount = (amount: number): string => {
  const magnitude = Math.abs(amount)
  const threshold = THRESHOLDS.find(candidate => magnitude >= candidate.limit)
  if (!threshold) {
    return `${amount}`
  }
  return `${parseFloat((amount / threshold.limit).toFixed(1))}${threshold.suffix}`
}
