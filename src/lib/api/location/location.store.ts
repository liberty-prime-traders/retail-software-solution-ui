import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {createInitialState} from '../base-api/base.state'
import {BaseStore} from '../base-api/base.store'
import {Location} from './location.model'
import {LocationState} from './location.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'locations'})
export class LocationStore extends BaseStore<Location, LocationState> {
  constructor() {
    super(createInitialState())
  }
}
