import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Loan} from './loan.model'

@Injectable({providedIn: 'root'})
export class LoanStore extends createBaseStore<Loan>() implements BaseStore<Loan> {
  readonly basePath = 'loans'
}
