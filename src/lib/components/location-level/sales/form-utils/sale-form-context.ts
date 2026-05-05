import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {apply, form} from '@angular/forms/signals'
import {SalePayment} from '../../../../api/location-level/sale-payment/sale-payment.model'
import {calculateTotalPaid, Sale} from '../../../../api/location-level/sale/sale.model'
import {SaleService} from '../../../../api/location-level/sale/sale.service'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {SaleFormVisibilityContext} from '../sale-form-visibility.context'
import {SaleFormDefinition} from './sale-form.definition'

@Injectable()
export class SaleFormContext {

  private readonly zonedDatesService = inject(ZonedDatesService)
  private readonly saleFormVisibilityContext = inject(SaleFormVisibilityContext)

  private readonly _originalSale = signal<Sale | null>(null)
  readonly originalSale = this._originalSale.asReadonly()
  private readonly saleFormValue = signal(SaleFormDefinition.createDefault())
  readonly saleForm = form(this.saleFormValue, SaleFormDefinition.saleFormSchema)
  readonly saleLines = computed(() => this.saleFormValue().lines)
  readonly orderTotal = computed(() => this.saleFormValue().orderTotal)
  readonly totalPaid = computed(() => this.saleFormValue().totalPaid)
  readonly balanceDue = computed(() => this.saleFormValue().balanceDue)
  readonly payments = signal<Partial<SalePayment>[]>([])

  recalculateTotals() {
    const orderTotal = this.saleFormValue().lines.reduce(
      (sum, line) => sum + (line.quantity * line.unitPrice), 0
    )
    const totalPaid = calculateTotalPaid(this.payments())
    this.saleForm.orderTotal().value.set(orderTotal)
    this.saleForm.totalPaid().value.set(totalPaid)
    this.saleForm.balanceDue().value.set(orderTotal - totalPaid)
  }

  addPayment(payment: Partial<SalePayment>) {
    this.payments.update(payments => [payment, ...payments])
    this.recalculateTotals()
  }

  removePayment(fakeId?: number) {
    if (fakeId !== undefined) {
      this.payments.update(payments => payments.filter(p => p.fakeId !== fakeId))
      this.recalculateTotals()
    }
  }

  initializeForm(sale: Sale | null) {
    this._originalSale.set(sale)
    this.saleForm().reset(SaleFormDefinition.convertToFormModel(sale))
    this.payments.set(sale?.payments ?? [])
    if (sale) {
      this.saleFormVisibilityContext.showForm()
    }
  }

  getSavableFormValue(): Partial<Sale> {
    return SaleFormDefinition.convertToBackendModel(
      this.saleFormValue(), this.payments(), this.zonedDatesService
    )
  }
}
