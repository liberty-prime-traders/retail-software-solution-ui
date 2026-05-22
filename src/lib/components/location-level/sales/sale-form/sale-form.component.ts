import {Component, computed, inject, OnInit} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {Card} from 'primeng/card'
import {Select} from 'primeng/select'
import {ToggleButton} from 'primeng/togglebutton'
import {
  SaleSessionSummaryService
} from '../../../../api/location-level/sale-session-summary/sale-session-summary.service'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {SaleSummaryService} from '../../../../api/location-level/sale-summary/sale-summary.service'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {OpenSaleSessionsComponent} from '../open-sale-sessions/open-sale-sessions.component'
import {SaleFormHeaderComponent} from '../sale-form-header/sale-form-header.component'
import {SaleLinesComponent} from '../sale-lines/sale-lines.component'
import {SaleSummaryComponent} from '../sale-summary/sale-summary.component'

@Component({
  selector: 'rts-new-sale',
  templateUrl: 'sale-form.component.html',
  styleUrl: 'sale-form.component.scss',
  imports: [
    Card,
    FormField,
    FormFieldComponent,
    Select,
    ToggleButton,
    SaleSummaryComponent,
    SaleLinesComponent,
    LoadingContainerComponent,
    FormButtonsComponent,
    AutoStretchDirective,
    NullSafePipe,
    SaleFormHeaderComponent,
    OpenSaleSessionsComponent
  ]
})
export class SaleFormComponent extends HasSubscriptionComponent implements OnInit {

  private readonly contactService = inject(ContactService)
  private readonly context = inject(SaleFormContext)
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly saleSessionSummaryService = inject(SaleSessionSummaryService)

  private static readonly WalkInCustomerId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  readonly customers = this.contactService.customers
  readonly saleForm = this.context.saleForm
  readonly saleSession = this.context.saleSession
  readonly saleStatus = computed(() => this.saleSession().saleStatus)
  readonly currentContactId = computed(() => this.context.currentContactId())
  private readonly sessionIsPersisted = computed(() => !!this.saleSession().id)

  readonly showOpenSessions = computed(() =>
    this.saleSessionSummaryService.selectCount() > 0 && this.context.defaultToOpenSessionsView()
  )

  readonly sessionIsLoading = computed(() =>
    this.saleSessionService.selectLoading() || this.saleSessionSummaryService.selectLoading()
  )

  readonly canEditCustomer = computed(() =>
    !this.sessionIsPersisted() || this.saleSession().uiOptions.canMakeChangesToTheSale
  )

  readonly canVoidSale = computed(() =>
    this.sessionIsPersisted() && [SaleStatus.DRAFT, SaleStatus.CONFIRMED].includes(this.saleStatus())
  )

  readonly voidSaleLabel = computed(() =>
    this.saleStatus() === SaleStatus.DRAFT ? 'Discard Draft' : 'Void Sale'
  )

  ngOnInit() {
    this.contactService.fetch()
    this.context.showOpenSessions()
    this.saleSessionSummaryService.getMySessions()
  }

  onCustomerChange() {
    if (!this.currentContactId()) {
      this.startNewSession();
    } else {
      this.saleSessionService.updateHeader(
        {contactId: this.saleForm.contactId().value()},
        {onSuccess: this.context.onSuccessfulSave}
      )
    }
  }

  private startNewSession() {
    this.saleSessionService.startNewSession(
      {contactId: this.saleForm.contactId().value()},
      {onSuccess: this.context.onSuccessfulSave}
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

  voidSale() {
    //this.saleService.voidSale(this.context.saleSession()?.id!, {onSuccess: this.onSuccessfulSave})
  }
}
