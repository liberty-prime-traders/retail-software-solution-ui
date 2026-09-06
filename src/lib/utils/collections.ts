import {BaseModel} from '../api/util/base-api/base.model'

export namespace LibertyCollections {

  // some models don't carry a real id from the backend
  // and use referenceNumber as their identity instead
  export const identityOf = <V extends BaseModel>(v: V): string =>
    String(v.id ?? v.referenceNumber!)

  export const  deduplicateMap =  <K, V extends BaseModel>(map: Map<K, V[]>): Map<K, V[]> => {
    const result = new Map<K, V[]>()
    for (const [k, values] of map) {
      result.set(k, deduplicateArray(values))
    }
    return result
  }


  export const deduplicateArray = <V extends BaseModel>(values: V[]): V[] => {
    if (!Array.isArray(values)) {
      return [values]
    }
    const seen = new Set<string>()
    return values.filter(v => {
      const key = identityOf(v)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
}
