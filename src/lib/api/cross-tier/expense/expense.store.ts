import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Expense} from './expense.model'

@Injectable({providedIn: 'root'})
export class ExpenseStore extends createBaseStore<Expense>((entity) => entity.reference) implements BaseStore<Expense> {
  readonly basePath = 'expenses'
}
