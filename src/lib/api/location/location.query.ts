import {Injectable} from '@angular/core'
import {BaseQuery} from '../base-api/base.query'
import {Location} from './location.model'
import {LocationState} from './location.state'
import {LocationStore} from './location.store'

@Injectable({providedIn: 'root'})
export class LocationQuery extends BaseQuery<Location, LocationState> {
  constructor(protected override readonly store: LocationStore) {
    super(store)
  }
}
