import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {SortMeta} from 'primeng/api'
import {AutoCompleteModule} from 'primeng/autocomplete'
import {Button} from 'primeng/button'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {ProductForPurchase} from '../../../../../api/location-level/product-lookup/product-for-purchase.model'
import {PurchaseLineCancelDto} from '../../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../../api/location-level/purchase/purchase.service'
import {
  AlternativeUnitsFinderPipe
} from '../../../../../api/organization-level/unit-conversion/pipes/alternative-units-finder.pipe'
import {
  UnitDescriptionPipe
} from '../../../../../api/organization-level/unit-conversion/pipes/unit-description.pipe'
import {
  ConversionContextPipe,
  UnitConversionDescriptorPipe,
  UnitConvertPipe,
  UnitCurrencyPipe
} from '../../../../../api/organization-level/unit-conversion/pipes/unit-convert.pipe'
import {
  UnitConversionGraphService
} from '../../../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {ProductLabelPipe} from '../../../../../utils/pipes/product-label.pipe'
import {EmptyRowComponent} from '../../../../reusable/empty-row/empty-row.component'
import {PurchaseProductLookupComponent} from '../../../location-product-lookup/purchase-product-lookup/purchase-product-lookup.component'
import {PurchaseFormContext} from '../form-utils/purchase-form-context'
import {PurchaseLineFormDefinition} from '../form-utils/purchase-line-form.definition'
import PurchaseLineModel = PurchaseLineFormDefinition.PurchaseLineModel

@Component({
  selector: 'rts-purchase-lines',
  templateUrl: 'purchase-lines.component.html',
  imports: [
    TableModule,
    AutoCompleteModule,
    FormsModule,
    CurrencyPipe,
    ProductLabelPipe,
    InputNumber,
    Button,
    Select,
    NgClass,
    AlternativeUnitsFinderPipe,
    UnitDescriptionPipe,
    UnitConvertPipe,
    UnitCurrencyPipe,
    UnitConversionDescriptorPipe,
    ConversionContextPipe,
    UnitCurrencyPipe,
    UnitCurrencyPipe,
    UnitConversionDescriptorPipe,
    PurchaseProductLookupComponent,
    EmptyRowComponent
  ]
})
export class PurchaseLinesComponent {

  private readonly purchaseFormContext = inject(PurchaseFormContext)
  private readonly purchaseService = inject(PurchaseService)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  readonly unitConversionGraphIsLoading = this.unitConversionGraphService.isLoading
  readonly purchaseLinesFieldTree = this.purchaseFormContext.purchaseForm.purchaseLines
  readonly isOrderedOrPartiallyDelivered = this.purchaseFormContext.isOrderedOrPartiallyDelivered
  readonly isDraftOrNew = this.purchaseFormContext.isDraftOrNew
  readonly editingRowKeys = this.purchaseFormContext.keysForLinesBeingEdited
  private readonly linesBeingEdited = new Map<EntityId, PurchaseLineModel>()

  readonly purchaseLinesArray = computed(() =>
    this.unitConversionGraphIsLoading() ? [] : this.purchaseFormContext.purchaseLinesArray()
  )

  readonly selectedProductIds = computed(() =>
    this.purchaseLinesArray().map(l => l.locationProductId)
  )

  readonly emptyPurchaseLinesMessage = computed(() =>
    this.unitConversionGraphIsLoading() ? 'Loading ...' : 'No purchase lines added yet.'
  )

  readonly linesMultiSort: SortMeta[] = [
    {field: 'productGroupName', order: 1},
    {field: 'productName', order: 2},
    {field: 'referenceNumber', order: 3}
  ]


  initializeEditingLine(line: PurchaseLineModel) {
    this.editingRowKeys.update(keys => ({...keys, [line.referenceNumber]: true}))
    this.linesBeingEdited.set(line.referenceNumber, {...line})
  }

  cancelEditingLine(line: PurchaseLineModel) {
    const original = this.linesBeingEdited.get(line.referenceNumber)
    if (original) {
      this.purchaseLinesFieldTree().value.update(lines =>
        lines.map(l => l.referenceNumber === line.referenceNumber ? original : l)
      )
    }
    this.removeLineFromEditing(line)
  }

  completeEditingLine(line: PurchaseLineModel) {
    if(this.isOrderedOrPartiallyDelivered()) {
      this.cancelLines()

    } else {
      const quantityExpected = line.quantityOrdered - (line.quantityCanceled ?? 0)
      const quantityYetToBeDelivered = quantityExpected - (line.quantityDelivered ?? 0)
      const canceledWithoutSingleDelivery = quantityYetToBeDelivered + (line.quantityDelivered ?? 0) === 0
      const updated: PurchaseLineModel = {
        ...line,
        quantityExpected,
        quantityYetToBeDelivered,
        canceledWithoutSingleDelivery,
        lineTotal: quantityExpected * line.unitCost
      }
      this.purchaseLinesFieldTree().value.update(lines =>
        lines.map(l => l.referenceNumber === line.referenceNumber ? updated : l)
      )
      this.purchaseLinesFieldTree().markAsDirty()
      this.removeLineFromEditing(line)
    }
  }

  private removeLineFromEditing(line: PurchaseLineModel) {
    this.editingRowKeys.update(keys => {
      const {[line.referenceNumber]: _, ...rest} = keys
      return rest
    })
    this.linesBeingEdited.delete(line.referenceNumber)
  }

  addPurchaseLine(product: ProductForPurchase) {
    const productAlreadyAdded = this.purchaseLinesArray().some(
      line => line.referenceNumber === product?.referenceNumber
    )
    if (product && !productAlreadyAdded) {
      const newLine: PurchaseLineModel = PurchaseLineFormDefinition.createFromProduct(product)
      this.purchaseLinesFieldTree().value.update(lines => [...lines, newLine])
      this.purchaseLinesFieldTree().markAsDirty()
      this.editingRowKeys.update(keys => ({...keys, [newLine.referenceNumber]: true}))
    }
  }

  cancelLines() {
    const payload = this.purchaseFormContext.getSavableFormValue()
    const lines: PurchaseLineCancelDto[] = this.purchaseFormContext.purchaseLinesArray().map(line =>
      ({purchaseLineId: line.id, quantityCanceled: line.quantityCanceled})
    )
    if (payload.id && lines.length > 0) {
      this.purchaseService.cancelLines(
        payload.id as EntityId,
        lines,
        {onSuccess: (updatedPurchase) => {this.purchaseFormContext.initializeForm(updatedPurchase)}}
      )
    }
  }
}
