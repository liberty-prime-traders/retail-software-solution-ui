import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {
  FundMovement,
  FundMovementCapitalRequest,
  FundMovementDrawRequest,
  FundMovementRequest,
  FundMovementTransferRequest,
  FundMovementVoidRequest
} from './fund-movement.model'
import {FundMovementStore} from './fund-movement.store'

@Injectable({providedIn: 'root'})
export class FundMovementService extends BaseService<FundMovement, FundMovementRequest> {
  constructor(protected override readonly store: FundMovementStore) {
    super(store)
  }

  createTransfer(request: FundMovementTransferRequest, callbacks?: ApiCallbacks<FundMovement>) {
    this.patchApiRequestConfig({urlSuffix: 'transfer', upsertOnSuccess: true})
    return this.post(request, callbacks)
  }

  createCapital(request: FundMovementCapitalRequest, callbacks?: ApiCallbacks<FundMovement>) {
    this.patchApiRequestConfig({urlSuffix: 'capital', upsertOnSuccess: true})
    return this.post(request, callbacks)
  }

  createDraw(request: FundMovementDrawRequest, callbacks?: ApiCallbacks<FundMovement>) {
    this.patchApiRequestConfig({urlSuffix: 'draw', upsertOnSuccess: true})
    return this.post(request, callbacks)
  }

  voidFundMovement(request: FundMovementVoidRequest, callbacks?: ApiCallbacks<FundMovement>) {
    this.patchApiRequestConfig({urlSuffix: 'void', upsertOnSuccess: true})
    return this.post(request, callbacks)
  }
}
