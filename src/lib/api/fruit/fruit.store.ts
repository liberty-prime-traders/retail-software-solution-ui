import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {createInitialState} from '../base-api/base.state'
import {BaseStore} from '../base-api/base.store'
import {Fruit} from './fruit.model'
import {FruitState} from './fruit.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'fruits'})
export class FruitStore extends BaseStore<Fruit, FruitState> {
    
    constructor() {
        super(createInitialState())
    }
    
}