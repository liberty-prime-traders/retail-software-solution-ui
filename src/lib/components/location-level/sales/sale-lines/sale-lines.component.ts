import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MessageService} from 'primeng/api'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {SaleProductLookup} from '../../../../api/cross-tier/product/sale-product-lookup.model'
import {SaleStatus} from '../../../../api/location-level/sale/sale-status.enum'
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
import {ProductLabelPipe} from '../../../../utils/pipes/product-label.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {SaleProductLookupComponent} from '../../sale-product-lookup/sale-product-lookup.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleLineFormDefinition} from '../form-utils/sale-line-form.definition'

@Component({
  selector: 'rts-sale-lines',
  templateUrl: 'sale-lines.component.html',
  imports: [
    TableModule,
    FormsModule,
    CurrencyPipe,
    ProductLabelPipe,
    InputNumber,
    Select,
    AlternativeUnitsFinderPipe,
    FullUnitDescriptionPipe,
    UnitCurrencyPipe,
    UnitConversionDescriptorPipe,
    ConversionContextPipe,
    SaleProductLookupComponent,
    UnitConvertPipe,
    EmptyRowComponent
  ]
})
export class SaleLinesComponent {
  private readonly messageService = inject(MessageService)
  private readonly context = inject(SaleFormContext)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  readonly originalSale = this.context.originalSale
  private readonly saleLinesFieldTree = this.context.saleForm.lines
  readonly unitConversionGraphIsLoading = this.unitConversionGraphService.isLoading

  readonly canAddOrEditProducts = computed(() =>
    !this.originalSale() || this.originalSale()?.status === SaleStatus.DRAFT
  )

  readonly saleLines = computed(() =>
    this.unitConversionGraphIsLoading() ? [] : this.context.saleLines()
  )

  readonly selectedProductIds = computed(() =>
    this.saleLines().map(l => l.locationProductId)
  )

  readonly emptySaleLinesMessage = computed(() =>
    this.unitConversionGraphIsLoading() ? 'Loading ...' : 'No Sale lines added yet.'
  )

  addSaleLine(product: SaleProductLookup) {
    const alreadyAdded = this.saleLines().some(l => l.referenceNumber === product.referenceNumber)
    if (!alreadyAdded) {
      const newLine = SaleLineFormDefinition.createFromProduct(product)
      this.saleLinesFieldTree().value.update(lines => [...lines, newLine])
      this.saleLinesFieldTree().markAsDirty()
      this.context.recalculateTotals()

    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Product already added',
        detail: `${ProductLabelPipe.prototype.transform(product)} has already been added.`
      })
    }
  }

  completeEditingLine() {
    this.context.recalculateTotals()
  }
}
