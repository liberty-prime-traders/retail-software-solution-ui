import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Fruit} from './fruit.model'
import {FruitQuery} from './fruit.query'
import {FruitState} from './fruit.state'
import {FruitStore} from './fruit.store'

@Injectable({providedIn: 'root'})
export class FruitService extends BaseService<Fruit, FruitState> {
    
    constructor(protected override readonly store: FruitStore,
                protected override readonly query: FruitQuery) {
        super(store, query)
    }
}
