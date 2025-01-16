import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {BaseStore} from '../base-api/base.store'
import {createInitialState} from '../base-api/base.state'
import {CategoryState} from './category.state'
import {Category} from './category.model'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'category'})
export class CategoryStore extends BaseStore<Category, CategoryState> {
  constructor() {
    super(createInitialState())
  }
}
