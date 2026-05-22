import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {Tooltip} from 'primeng/tooltip'
import {SaleProductLookup} from '../../../../api/cross-tier/product/sale-product-lookup.model'
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
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {SaleProductLookupComponent} from '../../sale-product-lookup/sale-product-lookup.component'
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
    Tag,
    Tooltip
  ]
})
export class SaleLinesComponent {
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly context = inject(SaleFormContext)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

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

  addSaleLine(product: SaleProductLookup) {
    this.saleSessionService.addSaleLine(
      {
        locationProductId: product.id,
        unitId: product.baseUnitId,
        quantity: 1
      },
      {onSuccess: this.context.onSuccessfulSave}
    )
  }

  completeEditingLine(line: SaleLine) {
    this.saleSessionService.updateSaleLine(
      {
        identity: line.identity,
        unitId: line.unitId,
        quantity: line.quantity
      },
      {onSuccess: this.context.onSuccessfulSave}
    )
  }
}
