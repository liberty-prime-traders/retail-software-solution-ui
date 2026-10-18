import {BaseModel} from '../../util/base-api/base.model'
import {FundMovementType} from './fund-movement-type.enum'

export interface FundMovementAccount {
  code: string
  label: string
}

export interface FundMovementVoid {
  voidDate: string
  reason?: string
  voidedBy: string
}

export interface FundMovement extends BaseModel {
  type: FundMovementType
  debitAccount: FundMovementAccount
  creditAccount: FundMovementAccount
  amount: number
  movementDate: string
  note?: string
  createdOn: string
  createdBy: string
  void?: FundMovementVoid
}

export interface FundMovementTransferRequest {
  fromAccountCode: string
  toAccountCode: string
  amount: number
  movementDate: string
  note?: string
}

export interface FundMovementCapitalRequest {
  accountCode: string
  amount: number
  movementDate: string
  note?: string
}

export interface FundMovementDrawRequest {
  accountCode: string
  amount: number
  movementDate: string
  note?: string
}

export interface FundMovementVoidRequest {
  id: string
  reason?: string
}

export type FundMovementRequest =
  FundMovementTransferRequest
  | FundMovementCapitalRequest
  | FundMovementDrawRequest
  | FundMovementVoidRequest
