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
    return this.postRequest({body: request, callbacks, config: {urlSuffix: 'transfer', upsertOnSuccess: true}})
  }

  createCapital(request: FundMovementCapitalRequest, callbacks?: ApiCallbacks<FundMovement>) {
    return this.postRequest({body: request, callbacks, config: {urlSuffix: 'capital', upsertOnSuccess: true}})
  }

  createDraw(request: FundMovementDrawRequest, callbacks?: ApiCallbacks<FundMovement>) {
    return this.postRequest({body: request, callbacks, config: {urlSuffix: 'draw', upsertOnSuccess: true}})
  }

  voidFundMovement(request: FundMovementVoidRequest, callbacks?: ApiCallbacks<FundMovement>) {
    return this.postRequest({body: request, callbacks, config: {urlSuffix: 'void', upsertOnSuccess: true}})
  }
}
