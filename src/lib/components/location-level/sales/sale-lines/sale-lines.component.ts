import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {Tooltip} from 'primeng/tooltip'
import {ProductForSale} from '../../../../api/location-level/product-lookup/product-for-sale.model'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {
  SaleSessionLineAddRequest,
  SaleSessionLineUpdateRequest
} from '../../../../api/location-level/sale_session/sale-session-requests.model'
import {SaleLine} from '../../../../api/location-level/sale_session/sale-session.model'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {
  AlternativeUnitsFinderPipe
} from '../../../../api/organization-level/unit-conversion/pipes/alternative-units-finder.pipe'
import {
  FullUnitDescriptionPipe
} from '../../../../api/organization-level/unit-conversion/pipes/full-unit-description.pipe'
import {
  ConversionContextPipe,
  UnitConversionDescriptorPipe,
  UnitConvertPipe,
  UnitCurrencyPipe
} from '../../../../api/organization-level/unit-conversion/pipes/unit-convert.pipe'
import {
  UnitConversionGraphService
} from '../../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {IterableIncludesPipe} from '../../../../utils/pipes/iterable-includes.pipe'
import {ProductLabelPipe} from '../../../../utils/pipes/product-label.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {
  SaleProductLookupComponent
} from '../../location-product-lookup/sale-product-lookup/sale-product-lookup.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleLineFormDefinition} from '../form-utils/sale-line-form.definition'
import SaleLineFormModel = SaleLineFormDefinition.SaleLineFormModel

@Component({
  selector: 'rts-sale-lines',
  templateUrl: 'sale-lines.component.html',
  imports: [
    TableModule,
    FormsModule,
    CurrencyPipe,
    InputNumber,
    Select,
    AlternativeUnitsFinderPipe,
    UnitCurrencyPipe,
    UnitConversionDescriptorPipe,
    ConversionContextPipe,
    SaleProductLookupComponent,
    UnitConvertPipe,
    EmptyRowComponent,
    FullUnitDescriptionPipe,
    Button,
    IterableIncludesPipe,
    Tooltip,
    ProductLabelPipe
  ]
})
export class SaleLinesComponent {
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly context = inject(SaleFormContext)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  readonly saleLinesFieldTree = this.context.saleForm.saleLines
  readonly productIdsForTouchedLines = this.context.productIdsForTouchedLines
  readonly saleSession = this.context.saleSession
  readonly unitConversionGraphIsLoading = this.unitConversionGraphService.isLoading

  readonly canAddOrEditProducts = computed(() =>
    this.saleSession().uiOptions.canMakeChangesToTheSale
  )

  readonly saleLines = computed(() =>
    this.unitConversionGraphIsLoading() ? [] : this.context.saleLines()
  )

  readonly selectedProductIds = computed(() =>
    this.saleLines().map(l => l.locationProductId)
  )

  readonly linesBeingEdited = computed(() => {
    let result: Record<string, boolean> = {}
    if (this.saleSession().saleStatus !== SaleStatus.DRAFT) {
      return result
    }
    this.saleLines().forEach(line => {
      result = {...result, [line.locationProductId]: true}
    })
    return result
  })

  readonly emptySaleLinesMessage = computed(() =>
    this.unitConversionGraphIsLoading() ? 'Loading ...' : 'No Sale lines added yet.'
  )

  onSaleLineTouched(partial: Partial<SaleLineFormModel>, original: SaleLineFormModel) {
    this.context.onSaleLineTouched({...original, ...partial})
  }

  sendLineRequest(newProduct?: ProductForSale) {
    this.saleSessionService.updateSaleLines(
      {
        additions: this.getLinesToAdd(newProduct),
        updates: this.getLinesToUpdate()
      },
      {onSuccess: this.context.loadSession}
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
          quantity: saleLine.quantity
        }
    })
  }


  removeSaleLine(line: SaleLine) {
    this.saleSessionService.removeSaleLine(
      line.identity,
      {onSuccess: this.context.loadSession}
    )
  }
}
