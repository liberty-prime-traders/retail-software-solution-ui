import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {Location} from '../location/location.model'

@Injectable({providedIn: 'root'})
export class OrganizationLocationStore extends createBaseStore<Location>()
  implements BaseStore<Location> {
  readonly basePath = 'organizations'
}
