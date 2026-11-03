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
    return this.postRequest({body: request, callbacks, config: {urlSuffix: '', upsertOnSuccess: true}})
  }

  recordRepayment(request: LoanRepaymentCreateRequest, callbacks?: ApiCallbacks<Loan>) {
    return this.postRequest({body: request, callbacks, config: {urlSuffix: 'repayments', upsertOnSuccess: true}})
  }

  voidLoan(request: LoanVoidRequest, callbacks?: ApiCallbacks<Loan>) {
    return this.postRequest({body: request, callbacks, config: {urlSuffix: 'void', upsertOnSuccess: true}})
  }

  voidRepayment(request: LoanRepaymentVoidRequest, callbacks?: ApiCallbacks<Loan>) {
    return this.postRequest({body: request, callbacks, config: {urlSuffix: 'repayments/void', upsertOnSuccess: true}})
  }
}
