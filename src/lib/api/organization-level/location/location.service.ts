import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {Location} from './location.model'
import {LocationStore} from './location.store'
import '../../util/http-params.extension'

@Injectable({providedIn: 'root'})
export class LocationService extends BaseService<Location> {
  constructor(protected override readonly store: LocationStore) {
    super(store)
  }

  override getHttpParams(organizationId: string): HttpParams {
    return new HttpParams().setNonNull('organizationId', organizationId)
  }
}
