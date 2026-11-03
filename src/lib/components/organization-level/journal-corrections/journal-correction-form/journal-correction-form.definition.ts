import {applyEach, min, minLength, required, schema} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {ManualJournalEntryType} from '../../../../api/organization-level/manual-journal/manual-journal-entry-type.enum'
import {
  ManualJournalCreateRequest
} from '../../../../api/organization-level/manual-journal/manual-journal.model'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {getToday, toLocaleDateString} from '../../../../utils/dates'

export namespace JournalCorrectionFormDefinition {
  export interface JournalCorrectionLineModel {
    accountNode: TreeNode<Account> | null
    entryType: ManualJournalEntryType
    amount: number | null
    lineMemo: string
  }

  export interface JournalCorrectionFormModel {
    summary: string
    details: string
    postingDate: Date | null
    lines: JournalCorrectionLineModel[]
  }

  type JournalFields =  JournalCorrectionFormModel & JournalCorrectionLineModel
  export const fieldMap = new Map<keyof JournalFields, string>(
    [
      ['summary', 'Summary'],
      ['postingDate', 'Date'],
      ['lines', 'Lines'],
      ['accountNode', 'Account'],
      ['entryType', 'Entry Type'],
      ['amount', 'Amount'],
      ['lineMemo', 'Line Memo']
    ]
  )

  export const createDefaultLine = (): JournalCorrectionLineModel => ({
    accountNode: null,
    entryType: ManualJournalEntryType.DEBIT,
    amount: null,
    lineMemo: ''
  })

  export const createDefaultFormModel = (): JournalCorrectionFormModel => ({
    summary: '',
    details: '',
    postingDate: getToday(),
    lines: [createDefaultLine(), createDefaultLine()]
  })

  const lineSchema = schema<JournalCorrectionLineModel>((path) => {
    required(path.accountNode)
    required(path.entryType)
    required(path.amount)
    min(path.amount, 0.01)
  })

  export const formSchema = schema<JournalCorrectionFormModel>((path) => {
    required(path.summary)
    required(path.postingDate)
    applyEach(path.lines, lineSchema)
    minLength(path.lines, 2)
  })

  export const convertToCreateRequest = (formValue: JournalCorrectionFormModel): ManualJournalCreateRequest => ({
    summary: formValue.summary,
    details: formValue.details || undefined,
    postingDate: toLocaleDateString(formValue.postingDate),
    lines: formValue.lines.map(line => ({
      accountCode: line.accountNode!.key!,
      entryType: line.entryType,
      amount: line.amount!,
      lineMemo: line.lineMemo || undefined
    }))
  })
}
