import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Location} from './location.model'


@Injectable({providedIn: 'root'})
export class LocationStore extends createBaseStore<Location>() implements BaseStore<Location> {
  readonly basePath = 'locations'
}
