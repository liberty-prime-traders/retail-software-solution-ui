import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {UnitValue} from './unitvalue.model'
import {UnitValueQuery} from './unitvalue.query'
import {UnitValueState} from './unitvalue.state'
import {UnitValueStore} from './unitvalue.store'

@Injectable({providedIn: 'root'})
export class UnitValueService extends BaseService<UnitValue, UnitValueState> {
  constructor(protected override readonly store: UnitValueStore,
              protected override readonly query: UnitValueQuery) {
    super(store, query)
  }

  override getHttpParams(unitGroupId: string): HttpParams {
    return new HttpParams().setNonNull('unitGroupId', unitGroupId)
  }
}
