import {EntityId} from '@ngrx/signals/entities'
import {TreeNode} from 'primeng/api'
import {BaseModel} from '../../util/base-api/base.model'
import {AccountType} from './account-type.enum'
import {BalanceSignal} from './balance-signal.enum'

export interface Account extends BaseModel {
  code: string
  name: string
  displayName: string
  accountType: AccountType
  accountIsActive: boolean
  accountIsSystemMaintained: boolean
  accountIsExtensible: boolean
  currentBalance: number
  parentAccountCode?: string
  parentAccount?: string,
  balanceSignal: BalanceSignal
  openingBalance: number
}

export const toAccountTreeNodes = (accounts: Account[]): TreeNode<Account>[] => {
  const accountNodes = new Map<EntityId, TreeNode>()
  const roots: TreeNode[] = []

  accounts.forEach(account => {
    accountNodes.set(
      account.code,
      {
        label: account.displayName,
        data: account,
        key: account.code,
        children: []
      })
  })

  accounts.forEach(account => {
    const node = accountNodes.get(account.code)!
    if (account.parentAccountCode) {
      const parent = accountNodes.get(account.parentAccountCode)
      if (parent) {
        parent.children!.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })

  return roots
}
