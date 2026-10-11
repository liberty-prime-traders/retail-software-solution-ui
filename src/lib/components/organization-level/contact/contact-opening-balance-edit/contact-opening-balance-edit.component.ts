import {Component, inject, model, OnInit, signal} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {MessageService} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {InputNumber} from 'primeng/inputnumber'
import {Message} from 'primeng/message'
import {
  ContactOpeningBalanceRevisionService
} from '../../../../api/organization-level/contact-opening-balance/contact-opening-balance-revision.service'
import {Contact} from '../../../../api/organization-level/contact/contact.model'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {CurrencyCodeProviderService} from '../../../../utils/services/currency-code-provider.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {ContactOpeningBalanceEditDefinition} from './contact-opening-balance-edit.definition'

@Component({
  selector: 'rts-contact-opening-balance-edit',
  templateUrl: 'contact-opening-balance-edit.component.html',
  imports: [
    Message,
    FormFieldComponent,
    FormField,
    InputNumber,
    LoadingContainerComponent,
    ErrorSummaryComponent,
    ButtonDirective
  ]
})
export class ContactOpeningBalanceEditComponent implements OnInit {
  readonly currencyCodeProviderService = inject(CurrencyCodeProviderService)
  private readonly revisionService = inject(ContactOpeningBalanceRevisionService)
  private readonly messageService = inject(MessageService)
  private readonly contactService = inject(ContactService)

  readonly showDialog = model(false)
  readonly contact = model.required<Contact | undefined>()

  readonly loading = this.revisionService.selectLoading
  readonly failureMessages = this.revisionService.selectFailureMessages

  readonly formValue = signal<ContactOpeningBalanceEditDefinition.FormModel>(
    ContactOpeningBalanceEditDefinition.defaultFormModel
  )
  readonly openingBalanceForm = form(this.formValue, ContactOpeningBalanceEditDefinition.formSchema)
  readonly FormFieldLayout = FormFieldLayout

  ngOnInit() {
    this.revisionService.resetProcessingStatus()
  }

  save() {
    const {payable, receivable} = this.formValue()
    const contact = this.contact()
    if (!contact || !this.openingBalanceForm().valid() || payable === null || receivable === null) {
      return
    }
    this.revisionService.setOpeningBalance(contact.id, {payable, receivable}, {
      onSuccess: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Opening balance updated successfully'
        })
        this.contactService.refetch()
        this.showDialog.set(false)
      }
    })
  }
}
