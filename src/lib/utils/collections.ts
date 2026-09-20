import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../api/util/base-api/base.model'

export namespace LibertyCollections {

  export declare type OrArray<T> = T | T[]

  // some models don't carry a real id from the backend
  // and use referenceNumber as their identity instead
  export const identityOf = <V extends BaseModel>(v: V): string =>
    String(v.id ?? v.referenceNumber!)

  export const deduplicateMap = <K, V extends BaseModel>(
    map: Map<K, V[]>,
    selectId: (v: V) => EntityId = identityOf
  ): Map<K, V[]> => {
    const result = new Map<K, V[]>()
    for (const [k, values] of map) {
      result.set(k, deduplicateArray(values, selectId))
    }
    return result
  }


  export const deduplicateArray = <V extends BaseModel>(
    values: V[],
    selectId: (v: V) => EntityId = identityOf
  ): V[] => {
    if (!Array.isArray(values)) {
      return [values]
    }
    const seen = new Set<EntityId>()
    return values.filter(v => {
      const key = selectId(v)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
}
