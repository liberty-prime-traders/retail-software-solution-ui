import {disabled, required, schema} from '@angular/forms/signals'
import {AccountType} from '../../../../api/organization-level/chart-of-accounts/account-type.enum'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'

export namespace AccountFormDefinition {
  export interface AccountFormModel {
    id: string
    name: string
    parentAccountCode: string
    accountType: AccountType | null
    isRoot: boolean
  }

  export const fieldMap = new Map<keyof AccountFormModel, string>(
    [
      ['name', 'Name'],
      ['parentAccountCode', 'Parent Account'],
      ['accountType', 'Account Type']
    ]
  )

  export const defaultAccountFormModel: AccountFormModel = {
    id: '',
    name: '',
    parentAccountCode: '',
    accountType: null,
    isRoot: false
  }

  export const accountFormSchema = schema<AccountFormModel>((path) => {
    required(path.name)

    required(path.parentAccountCode, {
      when: ({valueOf}) => !valueOf(path.id) && !valueOf(path.isRoot)
    })
    disabled(path.parentAccountCode, ({valueOf}) => valueOf(path.isRoot))

    disabled(path.accountType, ({valueOf}) => !valueOf(path.isRoot))
    required(path.accountType, {
      when: ({valueOf}) => !valueOf(path.id) && valueOf(path.isRoot)
    })
  })

  export const convertToFormModel = (account?: Account): AccountFormModel => ({
    id: account?.id as string ?? '',
    name: account?.name ?? '',
    parentAccountCode: '',
    accountType: null,
    isRoot: false
  })
}
