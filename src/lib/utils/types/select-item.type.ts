import {EntityId} from '@ngrx/signals/entities'
import {groupBy} from 'lodash-es'

export interface SelectItem<T> {
  label: string
  value: EntityId
  items?: SelectItem<T>[]
}

export interface ToSelectItemOptions<GROUP, VALUE> {
  itemLabelBy: (item: VALUE) => string
  itemValueBy: (item: VALUE) => EntityId
  groupBy?: (item: VALUE) => EntityId
  groupLabelBy?: (item: GROUP) => string
  groupValueBy?: (group: GROUP) => EntityId
}

export const toSelectItems = <GROUP, VALUE>(
  values: VALUE[],
  options: ToSelectItemOptions<GROUP, VALUE>,
  groups?: GROUP[],
): SelectItem<VALUE>[] => {
  if (groups && options.groupBy) {
    if(!options.groupLabelBy || !options.groupValueBy) {
      throw new Error('groupLabelBy and groupValueBy must be provided when groupBy is used')
    }
    const valuesHashMap = groupBy(values, options.groupBy)
    const result: SelectItem<VALUE>[] = []
    groups.forEach((group) => {
      const label = options.groupLabelBy!(group) ?? '--'
      const value = options.groupValueBy!(group) ?? ''
      const items = valuesHashMap[options.groupValueBy!(group)]?.map(item => ({
        label: options.itemLabelBy(item),
        value: options.itemValueBy(item)
      }))
      if (items && items.length > 0) {
        result.push({label, value, items})
      }
    })
    return result
  } else {
    return values.map(item => ({
      label: options.itemLabelBy(item),
      value: options.itemValueBy(item)
    }))
  }
}
