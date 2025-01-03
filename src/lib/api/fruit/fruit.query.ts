import {Injectable} from '@angular/core'
import {BaseQuery} from '../base-api/base.query'
import {Fruit} from './fruit.model'
import {FruitState} from './fruit.state'
import {FruitStore} from './fruit.store'

@Injectable({providedIn: 'root'})
export class FruitQuery extends BaseQuery<Fruit, FruitState> {
    constructor(protected override readonly store: FruitStore) {
        super(store)
    }
}
