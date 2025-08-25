import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Location} from '../location/location.model'
import {OrganizationLocationStore} from './organization-location.store'

@Injectable({providedIn: 'root'})
export class OrganizationLocationService extends BaseService<Location> {
  constructor(protected override readonly store: OrganizationLocationStore) {
    super(store)
  }
}
