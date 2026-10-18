import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {
  Loan,
  LoanCreateRequest,
  LoanRepaymentCreateRequest,
  LoanRepaymentVoidRequest,
  LoanRequest,
  LoanVoidRequest
} from './loan.model'
import {LoanStore} from './loan.store'

@Injectable({providedIn: 'root'})
export class LoanService extends BaseService<Loan, LoanRequest> {
  constructor(protected override readonly store: LoanStore) {
    super(store)
  }

  createLoan(request: LoanCreateRequest, callbacks?: ApiCallbacks<Loan>) {
    this.patchApiRequestConfig({urlSuffix: '', upsertOnSuccess: true})
    return this.post(request, callbacks)
  }

  recordRepayment(request: LoanRepaymentCreateRequest, callbacks?: ApiCallbacks<Loan>) {
    this.patchApiRequestConfig({urlSuffix: 'repayments', upsertOnSuccess: true})
    return this.post(request, callbacks)
  }

  voidLoan(request: LoanVoidRequest, callbacks?: ApiCallbacks<Loan>) {
    this.patchApiRequestConfig({urlSuffix: 'void', upsertOnSuccess: true})
    return this.post(request, callbacks)
  }

  voidRepayment(request: LoanRepaymentVoidRequest, callbacks?: ApiCallbacks<Loan>) {
    this.patchApiRequestConfig({urlSuffix: 'repayments/void', upsertOnSuccess: true})
    return this.post(request, callbacks)
  }
}
