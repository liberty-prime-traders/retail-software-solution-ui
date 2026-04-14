import {TreeNode} from 'primeng/api'
import {BaseModel} from '../../util/base-api/base.model'
import {Account} from '../chart-of-accounts/account.model'

export interface AccountsTreesForSelection extends BaseModel {
  payable: TreeNode<Account>[]
  recoverable: TreeNode<Account>[]
  paymentMethods: TreeNode<Account>[]
}
