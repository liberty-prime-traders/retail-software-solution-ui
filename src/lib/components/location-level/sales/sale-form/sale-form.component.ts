import {Component, computed, inject, OnInit} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {Select} from 'primeng/select'
import {ToggleButton} from 'primeng/togglebutton'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {
  UnsavedCartsSummaryService
} from '../../../../api/location-level/unsaved-carts-summary/unsaved-carts-summary.service'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormMode} from '../form-utils/sale-form-mode.enum'
import {SaleFormNavigator} from '../form-utils/sale-form-navigator'
import {SaleFormHeaderComponent} from '../sale-form-header/sale-form-header.component'
import {SaleFormSummaryComponent} from '../sale-form-summary/sale-form-summary.component'
import {SaleLinesComponent} from '../sale-lines/sale-lines.component'
import {UnsavedCartsComponent} from '../unsaved-carts/unsaved-carts.component'

@Component({
  selector: 'rts-new-sale',
  templateUrl: 'sale-form.component.html',
  styleUrl: 'sale-form.component.scss',
  imports: [
    FormField,
    FormFieldComponent,
    Select,
    ToggleButton,
    SaleFormSummaryComponent,
    SaleLinesComponent,
    LoadingContainerComponent,
    AutoStretchDirective,
    NullSafePipe,
    SaleFormHeaderComponent,
    UnsavedCartsComponent
  ]
})
export class SaleFormComponent extends HasSubscriptionComponent implements OnInit {

  private readonly contactService = inject(ContactService)
  private readonly context = inject(SaleFormContext)
  private readonly navigator = inject(SaleFormNavigator)
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly saleSessionSummaryService = inject(UnsavedCartsSummaryService)

  private static readonly WalkInCustomerId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  readonly customers = this.contactService.customers
  readonly saleForm = this.context.saleForm
  readonly saleSession = this.context.saleSession
  readonly currentContactId = computed(() => this.context.currentContactId())
  private readonly sessionIsPersisted = computed(() => !!this.saleSession().id)

  readonly showUnsavedCarts = computed(() => this.navigator.mode() === SaleFormMode.PICKER)

  readonly sessionIsLoading = computed(() =>
    this.saleSessionService.selectLoading() || this.saleSessionSummaryService.selectLoading()
  )

  readonly canEditCustomer = computed(() =>
    !this.sessionIsPersisted() || this.saleSession().uiOptions.canMakeChangesToTheSale
  )

  ngOnInit() {
    this.contactService.fetch()
  }

  onCustomerChange() {
    if (!this.currentContactId()) {
      this.startNewSession();
    } else {
      this.saleSessionService.updateHeader(
        {contactId: this.saleForm.contactId().value()},
        {onSuccess: this.context.loadSession}
      )
    }
  }

  private startNewSession() {
    this.saleSessionService.startNewSession(
      {contactId: this.saleForm.contactId().value()},
      {onSuccess: this.context.loadSession}
    );
  }

  respondToWalkInCustomer(walkInCustomer: boolean) {
    const newId = walkInCustomer ? SaleFormComponent.WalkInCustomerId : '';
    const wasEmpty = !this.currentContactId();
    this.saleForm.contactId().value.set(newId);
    if (walkInCustomer && wasEmpty) {
      this.startNewSession();
    } else {
      this.onCustomerChange();
    }
  }

}
