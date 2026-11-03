import {Component, inject, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {FieldTree, form, FormField} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {Textarea} from 'primeng/textarea'
import {TreeSelect} from 'primeng/treeselect'
import {AccountTreesService} from '../../../../api/organization-level/account-trees/account-trees.service'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {ManualJournalEntryType} from '../../../../api/organization-level/manual-journal/manual-journal-entry-type.enum'
import {ManualJournalService} from '../../../../api/organization-level/manual-journal/manual-journal.service'
import {getToday} from '../../../../utils/dates'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {JournalCorrectionFormDefinition} from './journal-correction-form.definition'

@Component({
  selector: 'rts-journal-correction-form',
  templateUrl: 'journal-correction-form.component.html',
  imports: [
    FormsModule,
    FormField,
    ButtonDirective,
    FormButtonsComponent,
    FormFieldComponent,
    LoadingContainerComponent,
    DatePicker,
    InputNumber,
    InputText,
    Select,
    TreeSelect,
    EnumToDropdownPipe,
    Textarea
  ]
})
export class JournalCorrectionFormComponent extends BaseFormComponent<ManualJournalService> implements OnInit {
  private readonly manualJournalService = inject(ManualJournalService)
  private readonly accountTreesService = inject(AccountTreesService)
  protected override readonly apiService = this.manualJournalService

  readonly manualJournalCreated = output<void>()

  readonly ManualJournalEntryType = ManualJournalEntryType
  readonly today = getToday()
  readonly manualJournalTrees = this.accountTreesService.manualJournals
  readonly accountTreesLoading = this.accountTreesService.selectLoading

  readonly formValue = signal<JournalCorrectionFormDefinition.JournalCorrectionFormModel>(
    JournalCorrectionFormDefinition.createDefaultFormModel()
  )

  readonly journalForm = form(this.formValue, JournalCorrectionFormDefinition.formSchema)
  readonly fieldMap = JournalCorrectionFormDefinition.fieldMap

  override ngOnInit() {
    super.ngOnInit()
    this.accountTreesService.fetch()
  }

  addLine() {
    this.formValue.update(value => ({...value, lines: [...value.lines, JournalCorrectionFormDefinition.createDefaultLine()]}))
  }

  // [formField] on p-tree-select overflows the stack, so the account node is bridged through ngModel
  setAccountNode(line: FieldTree<JournalCorrectionFormDefinition.JournalCorrectionLineModel>, node: TreeNode<Account> | null) {
    line.accountNode().value.set(node)
    line.accountNode().markAsDirty()
  }

  removeLine(lineIndex: number) {
    this.formValue.update(value => ({...value, lines: value.lines.filter((_, index) => index !== lineIndex)}))
  }

  resetForm() {
    this.journalForm().reset(JournalCorrectionFormDefinition.createDefaultFormModel())
  }

  save() {
    this.manualJournalService.createManualJournal(
      JournalCorrectionFormDefinition.convertToCreateRequest(this.formValue()),
      {onSuccess: () => this.manualJournalCreated.emit()}
    )
  }
}
