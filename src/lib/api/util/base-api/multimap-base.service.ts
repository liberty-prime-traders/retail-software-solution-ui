import {HttpParams} from '@angular/common/http'
import {computed, Signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {get, groupBy} from 'lodash-es'
import {Subscription} from 'rxjs'
import {Multimap} from '../../../utils/types/multimap.type'
import {BaseModel} from './base.model'
import {BaseService} from './base.service'

export abstract class MultimapBaseService<RESPONSE extends BaseModel> extends BaseService<RESPONSE> {

  protected abstract keyPath: keyof RESPONSE
  private readonly cache = new Multimap<RESPONSE>()

  readonly selectAllAsMap = computed(() =>
    this.cache.asMap()
  )

  readonly selectForGroup =  (key: Signal<EntityId|undefined>) =>
    computed(() => {
      if (!key()) {
        return []
      }
      return this.cache.get(String(key())) ?? []
    })

  override getHttpParams(key: string): HttpParams {
    return new HttpParams().setNonNull(String(this.keyPath), key)
  }

  override refetch(key: EntityId | undefined) {
    if (!key || this.cache.has(String(key))) {
      return undefined
    }
    return super.refetch(key)
  }

  forceRefetch(key: EntityId): Subscription | undefined {
    this.cache.delete(String(key))
    return super.refetch(key)
  }

  override finishSavingWithSuccess(result: RESPONSE | RESPONSE[]) {
    if (result) {
      if (Array.isArray(result)) {
        const map: Map<string, RESPONSE[]> = Multimap.createFromObject(groupBy(result, this.keyPath))
        this.cache.patchFromMap(map)
      } else {
        this.cache.patch(String(get(result,this.keyPath)), [result])
      }
    }
    super.finishSavingWithSuccess(result)
  }

  override finishDeletingWithSuccess(id: EntityId) {
    this.cache.keys().forEach(key => {
      if (this.cache.hasEntry(key, id)) {
        this.cache.deleteById(key, id)
      }
    })
    super.finishDeletingWithSuccess(id)
  }
}
