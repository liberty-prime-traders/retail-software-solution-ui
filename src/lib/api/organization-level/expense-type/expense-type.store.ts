import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ExpenseType} from './expense-type.model'

@Injectable({providedIn: 'root'})
export class ExpenseTypeStore extends createBaseStore<ExpenseType>() implements BaseStore<ExpenseType> {
  readonly basePath = 'expense-types'
}
