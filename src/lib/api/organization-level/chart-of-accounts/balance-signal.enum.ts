export enum BalanceSignal {
  MONEY_IN = 'MONEY_IN',
  MONEY_OUT = 'MONEY_OUT',
  IRREGULAR_BALANCE = 'IRREGULAR_BALANCE',
  ZERO_BALANCE = 'ZERO_BALANCE'
}

export const findColorClass = (balanceSignal: BalanceSignal) => {
  switch (balanceSignal) {
    case BalanceSignal.MONEY_IN:
      return 'money-in'
    case BalanceSignal.MONEY_OUT:
      return 'money-out'
    case BalanceSignal.IRREGULAR_BALANCE:
      return 'irregular-balance'
    default:
      return 'zero-balance'
  }
}
