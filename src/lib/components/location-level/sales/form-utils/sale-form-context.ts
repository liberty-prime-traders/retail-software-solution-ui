import {computed, Injectable, signal} from '@angular/core'
import {form} from '@angular/forms/signals'
import {defaultSaleSession} from '../../../../api/location-level/sale_session/sale-session-default.value'
import {SaleSession} from '../../../../api/location-level/sale_session/sale-session.model'
import {SaleFormDefinition} from './sale-form.definition'
import {SaleLineFormDefinition} from './sale-line-form.definition'

@Injectable({providedIn: 'root'})
export class SaleFormContext {

  private readonly _saleSession = signal<SaleSession>(defaultSaleSession())
  private readonly _productIdsForTouchedLines = signal(new Set<string>())

  readonly currentContactId = computed(() => this.saleSession().contactId)
  readonly saleSession = this._saleSession.asReadonly()
  private readonly saleFormValue = signal(SaleFormDefinition.createDefault())
  readonly productIdsForTouchedLines = this._productIdsForTouchedLines.asReadonly()
  readonly saleLines = computed(() => this.saleFormValue().saleLines)
  readonly payments = computed(() => this.saleSession().salePayments)

  readonly saleForm = form(
    this.saleFormValue,
    SaleFormDefinition.createSaleFormSchema(this.productIdsForTouchedLines)
  )

  readonly loadSession = (session: SaleSession) => {
    this._saleSession.set(session)
    this._productIdsForTouchedLines.set(new Set<string>())
    this.saleForm().reset(SaleFormDefinition.convertToFormModel(session))
  }

  onSaleLineTouched(saleLine: Partial<SaleLineFormDefinition.SaleLineFormModel>) {
    const locationProductId = saleLine.locationProductId!
    const productIdsForTouchedLines = this.productIdsForTouchedLines()
    if (SaleLineFormDefinition.hasChanged(saleLine)) {
      productIdsForTouchedLines.add(locationProductId)
    } else {
      productIdsForTouchedLines.delete(locationProductId)
    }
    this._productIdsForTouchedLines.set(new Set(productIdsForTouchedLines))
  }
}
