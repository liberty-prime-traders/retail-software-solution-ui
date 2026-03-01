import {CurrencyPipe, DatePipe, NgStyle} from '@angular/common'
import {Component, inject, Input} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {FormField} from '@angular/forms/signals'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {DatePicker} from 'primeng/datepicker'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {Tag} from 'primeng/tag'
import {Purchase} from '../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {OrganizationUserService} from '../../../../api/organization-level/organization_user/organization-user.service'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {PurchaseStatusSeverityPipe} from '../purchase-status-severity.pipe'
import {PurchaseFormContext} from './form-utils/purchase-form-context'
import {PurchaseGeneralFieldsFormDefinition} from './form-utils/purchase-general-fields-form.definition'
import {PurchaseLinesComponent} from './purchase-lines/purchase-lines.component'

@Component({
  selector: 'rts-purchase-form',
  templateUrl: 'purchase-form.component.html',
  styleUrl: 'purchase-form.component.scss',
  providers: [PurchaseFormContext],
  imports: [
    CurrencyPipe,
    DatePipe,
    DatePicker,
    FormField,
    FormFieldComponent,
    FormsModule,
    InputText,
    PrettifyEnumPipe,
    Select,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    PurchaseLinesComponent,
    PurchaseStatusSeverityPipe,
    Tag,
    AutoStretchDirective,
    ErrorSummaryComponent,
    Card,
    Button,
    NgStyle,
    LoadingContainerComponent
  ]
})
export class PurchaseFormComponent extends BaseFormComponent<PurchaseService> {

  private readonly purchaseService = inject(PurchaseService)
  private readonly contactService = inject(ContactService)
  private readonly organizationUserService = inject(OrganizationUserService)
  private readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly labelColumnSize = 3
  protected override readonly apiService = this.purchaseService
  readonly purchaseForm = this.purchaseFormContext.purchaseForm
  readonly generalFieldsForm = this.purchaseForm.generalFields

  @Input()
  set purchase(purchase: Purchase | null) {
    this.purchaseFormContext.initializeForm(purchase)
  }

  readonly purchaseFormFields = PurchaseGeneralFieldsFormDefinition.fieldMap
  readonly suppliers = this.contactService.suppliers
  readonly users = this.organizationUserService.selectAll
  readonly purchaseIsLoading = this.purchaseService.selectLoading

  override ngOnInit() {
    super.ngOnInit()
    this.contactService.fetch()
    this.organizationUserService.fetch()
  }

  resetForm() {
    this.purchaseFormContext.resetForm()
  }

  savePurchase() {
    const updated = this.purchaseFormContext.getSavableFormValue()
    if (updated.id) {
      this.purchaseService.put(updated)
    } else {
      this.purchaseService.post(updated)
    }
  }
}
