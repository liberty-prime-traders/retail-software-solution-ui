import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {Location} from '../../organization-level/location/location.model'
import {OrganizationLocationStore} from './organization-location.store'

@Injectable({providedIn: 'root'})
export class OrganizationLocationService extends BaseService<Location> {
  constructor(protected override readonly store: OrganizationLocationStore) {
    super(store)
  }

  override refetch(organizationId: string): Subscription | undefined {
    return super.refetch({pathSuffix: `${organizationId}/locations`})
  }
}
