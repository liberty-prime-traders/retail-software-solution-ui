import {SelectItem} from '../../../utils/types/select-item.type'

export enum TaxApplicationLevel {
  LINE_ITEM = 'LINE_ITEM',
  TRANSACTION = 'TRANSACTION'
}

export const TaxApplicationLevelOptions: SelectItem<TaxApplicationLevel>[] = [
  {label: 'Every line item gets taxed differently', value: TaxApplicationLevel.LINE_ITEM},
  {label: 'Applies once for the whole transaction', value: TaxApplicationLevel.TRANSACTION}
]
