import {HttpParams} from '@angular/common/http'
import {computed, Injectable, Signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Multimap} from '../../../utils/types/Multimap.type'
import {BaseService} from '../../util/base-api/base.service'
import {UnitValue} from './unitvalue.model'
import {UnitValueStore} from './unitvalue.store'

@Injectable({providedIn: 'root'})
export class UnitValueService extends BaseService<UnitValue> {

  private readonly unitValuesCache = new Multimap<UnitValue>()
  readonly selectForGroup =  (unitGroupId: Signal<EntityId>) =>
    computed(() => this.unitValuesCache.get(String(unitGroupId())) ?? [])

  constructor(protected override readonly store: UnitValueStore) {
    super(store)
  }

  override getHttpParams(unitGroupId: string): HttpParams {
    return new HttpParams().setNonNull('unitGroupId', unitGroupId)
  }

  override refetch(unitGroupId: EntityId) {
    if (this.unitValuesCache.has(String(unitGroupId))) {
      return undefined
    }
    return super.refetch(unitGroupId)
  }

  override finishSavingWithSuccess(result: UnitValue | UnitValue[]) {
    if (result) {
      if (Array.isArray(result)) {
        const unitGroupId = String(result[0].unitGroupId)
        this.unitValuesCache.set(unitGroupId, result)
      } else {
        this.unitValuesCache.patch(String(result.unitGroupId), [result])
      }
    }
    super.finishSavingWithSuccess(result)
  }
}
