import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {FundMovement} from './fund-movement.model'

@Injectable({providedIn: 'root'})
export class FundMovementStore extends createBaseStore<FundMovement>() implements BaseStore<FundMovement> {
  readonly basePath = 'fund-movements'
}
