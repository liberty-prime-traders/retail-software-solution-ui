import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Location} from './location.model'
import {LocationQuery} from './location.query'
import {LocationState} from './location.state'
import {LocationStore} from './location.store'
import 'lib/api/util/http-params.extension'

@Injectable({providedIn: 'root'})
export class LocationService extends BaseService<Location, LocationState> {
  constructor(protected override readonly store: LocationStore,
              protected override readonly query: LocationQuery) {
    super(store, query)
  }

  override getHttpParams(organizationId: string): HttpParams {
    return new HttpParams().setNonNull('organizationId', organizationId)
  }
}
