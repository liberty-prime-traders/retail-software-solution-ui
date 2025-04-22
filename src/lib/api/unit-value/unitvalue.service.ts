import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {UnitValue} from './unitvalue.model'
import {UnitValueStore} from './unitvalue.store'

@Injectable({providedIn: 'root'})
export class UnitValueService extends BaseService<UnitValue> {
  constructor(protected override readonly store: UnitValueStore) {
    super(store)
  }

  override getHttpParams(unitGroupId: string): HttpParams {
    return new HttpParams().setNonNull('unitGroupId', unitGroupId)
  }
}
