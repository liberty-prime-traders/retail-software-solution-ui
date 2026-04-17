import {HttpParams} from '@angular/common/http'
import {computed, Signal, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {get, groupBy} from 'lodash-es'
import {Subscription} from 'rxjs'
import {Multimap} from '../../../utils/types/multimap.type'
import {BaseModel} from './base.model'
import {BaseService} from './base.service'
import {PARAMS} from './fetch-service'

export abstract class MultimapBaseService<RESPONSE extends BaseModel> extends BaseService<RESPONSE> {

  protected abstract keyPath: keyof RESPONSE
  private readonly cache = new Multimap<RESPONSE>()
  private readonly fetchedAll = signal(false)

  readonly selectAllAsMap = computed(() =>
    this.cache.asMap()
  )

  readonly selectForGroup =  (key: Signal<EntityId>) =>
    computed(() => this.cache.get(String(key())) ?? [])

  override fetch(params?: PARAMS): Subscription | undefined {
    if (this.fetchedAll()) {
      return undefined
    }
    this.fetchedAll.set(true)
    return super.fetch(params)
  }

  override getHttpParams(key: string): HttpParams {
    return new HttpParams().setNonNull(String(this.keyPath), key)
  }

  override refetch(key: EntityId) {
    if (this.cache.has(String(key))) {
      return undefined
    }
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
