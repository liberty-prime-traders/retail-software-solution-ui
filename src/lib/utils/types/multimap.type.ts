import {signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../api/util/base-api/base.model'
import {LibertyCollections} from '../collections'


export declare type OrMultimap<V extends BaseModel> = (V | Multimap<V>) & BaseModel

export class Multimap<V extends BaseModel> {
  private readonly map = signal(new Map<string, V[]>())
  private readonly selectId: (entity: V) => EntityId

  constructor(initial?: object, deduplicated = false, selectId: (entity: V) => EntityId = LibertyCollections.identityOf) {
    this.selectId = selectId
    if (!initial) {
      this.map.set(new Map())
    } else if (!Multimap.isAssignableFrom(initial)) {
      throw new Error('Invalid initial value for Multimap: must be object with array values')
    } else {
      this.map.set(Multimap.createFromObject(initial, deduplicated, selectId))
    }
  }

  static createFromObject<T extends BaseModel>(
    obj: unknown,
    deduplicated = false,
    selectId: (entity: T) => EntityId = LibertyCollections.identityOf
  ): Map<string, T[]> {
    const objRecord = obj as Record<string, T>
    const result = new Map<string, T[]>()
    for (const [key, value] of Object.entries(objRecord)) {
      if (Array.isArray(value)) {
        const effectiveValue = deduplicated ? LibertyCollections.deduplicateArray(value as T[], selectId) : [...(value as T[])]
        result.set(key, effectiveValue)
      } else {
        result.set(key, [value])
      }
    }
    return result
  }

  static isAssignableFrom<T extends BaseModel>(obj: object): obj is Multimap<T> {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false
    const record = obj as Record<string, unknown>
    return Object.values(record).every(v =>
      Array.isArray(v) || (v && typeof v === 'object' && !Array.isArray(v))
    )
  }

  asMap(): Map<string, V[]> {
    return this.map()
  }

  keys(): Set<string> {
    return new Set(this.map().keys())
  }

  values(): V[] {
    return Array.from(this.map().values()).flat()
  }

  get(key: string): V[] {
    return this.map().get(key) ?? []
  }

  has(key: string): boolean {
    return this.map().has(key)
  }

  hasEntry(key: string, id: EntityId): boolean {
    return (this.map().get(key) ?? []).some(v => this.selectId(v) === id)
  }

  set(key: string, values: V[]): Multimap<V> {
    const unique = LibertyCollections.deduplicateArray(values, this.selectId)
    return this.updateMap(m => {
      if (unique.length === 0) {
        m.delete(key)
      } else {
        m.set(key, unique)
      }
    })
  }

  patchFromMap(otherMap: Map<string, V[]>) {
    otherMap.forEach((v, k) => {
      this.patch(k, v)
    })
    return this
  }

  patch(key: string, collection: readonly V[]): Multimap<V> {
    if (collection.length === 0) return this
    const collectionIds = new Set(collection.map(v => this.selectId(v)))
    const bucketByEntityId = this.buildReverseLookup()
    const staleIdsByKey = new Map<string, EntityId[]>()

    for (const id of collectionIds) {
      const bucketHoldingCurrentId = bucketByEntityId.get(id)
      if (bucketHoldingCurrentId && bucketHoldingCurrentId !== key) {
        staleIdsByKey.set(bucketHoldingCurrentId, [...(staleIdsByKey.get(bucketHoldingCurrentId) ?? []), id])
      }
    }

    return this.updateMap(m => {
      staleIdsByKey.forEach((ids, staleKey) => {
        const idsToRemove = new Set(ids)
        const filtered = (m.get(staleKey) ?? []).filter(v => !idsToRemove.has(this.selectId(v)))
        filtered.length ? m.set(staleKey, filtered) : m.delete(staleKey)
      })
      const merged = LibertyCollections.deduplicateArray(
        (m.get(key) ?? []).filter(it => !collectionIds.has(this.selectId(it))).concat(collection),
        this.selectId
      )
      if (merged.length === 0) {
        m.delete(key)
      } else {
        m.set(key, merged)
      }
    })
  }

  deleteById(key: string, id: EntityId): Multimap<V> {
    const existing = this.get(key)
    const filtered = existing.filter(v => this.selectId(v) !== id)
    return this.updateMap(newMap => {
      if (filtered.length > 0) {
        newMap.set(key, filtered)
      } else {
        newMap.delete(key)
      }
    })
  }

  delete(key: string): Multimap<V> {
    return this.updateMap(newMap => newMap.delete(key))
  }

  clear(): Multimap<V> {
    return this.updateMap(newMap => newMap.clear())
  }

  merge(other: Multimap<V>): Multimap<V> {
    for (const [k, v] of other.map()) {
      this.patch(k, v)
    }
    return this
  }

  private updateMap(mutator: (map: Map<string, V[]>) => void): Multimap<V> {
    const newMap = new Map(this.map())
    mutator(newMap)
    this.map.set(newMap)
    return this
  }

  private buildReverseLookup(): Map<EntityId, string> {
    const index = new Map<EntityId, string>()
    for (const [key, values] of this.map()) {
      for (const v of values) index.set(this.selectId(v), key)
    }
    return index
  }

}
