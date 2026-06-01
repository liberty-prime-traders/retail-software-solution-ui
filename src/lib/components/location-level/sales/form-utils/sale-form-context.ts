import {computed, inject, Injectable, signal} from '@angular/core'
import {form} from '@angular/forms/signals'
import {ProductForSale} from '../../../../api/location-level/product-lookup/product-for-sale.model'
import {defaultSaleSession} from '../../../../api/location-level/sale_session/sale-session-default.value'
import {
  SaleSessionLineAddRequest,
  SaleSessionLineUpdateRequest
} from '../../../../api/location-level/sale_session/sale-session-requests.model'
import {SaleSession} from '../../../../api/location-level/sale_session/sale-session.model'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {SaleFormDefinition} from './sale-form.definition'
import {SaleLineFormDefinition} from './sale-line-form.definition'

@Injectable({providedIn: 'root'})
export class SaleFormContext {

  private readonly saleSessionService = inject(SaleSessionService)

  private readonly _saleSession = signal<SaleSession>(defaultSaleSession())
  private readonly _productIdsForTouchedLines = signal(new Set<string>())

  readonly currentContactId = computed(() => this.saleSession().contactId)
  readonly saleSession = this._saleSession.asReadonly()
  private readonly saleFormValue = signal(SaleFormDefinition.createDefault())
  readonly productIdsForTouchedLines = this._productIdsForTouchedLines.asReadonly()
  readonly saleLines = computed(() => this.saleFormValue().saleLines)
  readonly payments = computed(() => this.saleSession().salePayments)

  readonly saleForm = form(this.saleFormValue, SaleFormDefinition.saleFormSchema)

  readonly loadSession = (session: SaleSession) => {
    this._saleSession.set(session)
    this._productIdsForTouchedLines.set(new Set<string>())
    this.saleForm().reset(SaleFormDefinition.convertToFormModel(session))
  }

  sendLineRequest(newProduct?: ProductForSale) {
    this.saleSessionService.updateSaleLines(
      {
        additions: this.getLinesToAdd(newProduct),
        updates: this.getLinesToUpdate()
      },
      {onSuccess: this.loadSession}
    )
  }

  private getLinesToAdd(newProduct?: ProductForSale): SaleSessionLineAddRequest[] {
    if (newProduct) {
      return [{locationProductId: newProduct.id, quantity: 1}]
    }
    return []
  }

  private getLinesToUpdate(): SaleSessionLineUpdateRequest[] {
    return this.saleLines()
      .filter(SaleLineFormDefinition.hasChanged)
      .map(saleLine => {
        return {
          identity: saleLine.identity,
          unitId: saleLine.unitId,
          quantity: saleLine.quantity,
          unitPriceOverride: saleLine.unitPriceOverride
        }
      })
  }
}
