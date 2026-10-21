export enum BalanceEffect {
  ADDS = 'ADDS',
  SUBTRACTS = 'SUBTRACTS',
  IRREGULAR = 'IRREGULAR',
  ZERO = 'ZERO'
}

export const findColorClass = (balanceEffect?: BalanceEffect) => {
  switch (balanceEffect) {
    case BalanceEffect.ADDS:
      return 'money-in'
    case BalanceEffect.SUBTRACTS:
      return 'money-out'
    case BalanceEffect.IRREGULAR:
      return 'irregular-balance'
    default:
      return 'zero-balance'
  }
}

export const effectOfSignedAmount = (amount: number): BalanceEffect => {
  if (amount > 0) return BalanceEffect.ADDS
  if (amount < 0) return BalanceEffect.SUBTRACTS
  return BalanceEffect.ZERO
}
