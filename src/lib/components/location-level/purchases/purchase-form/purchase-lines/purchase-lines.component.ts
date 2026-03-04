import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {FormsModule} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {AutoCompleteModule} from 'primeng/autocomplete'
import {Button} from 'primeng/button'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {BehaviorSubject, debounceTime, distinctUntilChanged, filter} from 'rxjs'
import {tap} from 'rxjs/operators'
import {
  LocationProductQuickSearchService
} from '../../../../../api/location-level/location-product/location-product-quick-search.service'
import {LocationProductStore} from '../../../../../api/location-level/location-product/location-product.store'
import {PurchaseLineCancelDto} from '../../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../../api/location-level/purchase/purchase.service'
import {ProductLabelPipe} from '../../../../../utils/pipes/product-label.pipe'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../../../reusable/has-subscription.component'
import {PurchaseFormContext} from '../form-utils/purchase-form-context'
import {PurchaseLineFormDefinition} from '../form-utils/purchase-line-form.definition'
import PurchaseLineModel = PurchaseLineFormDefinition.PurchaseLineModel

@Component({
  selector: 'rts-purchase-lines',
  templateUrl: 'purchase-lines.component.html',
  providers: [
    LocationProductQuickSearchService,
    LocationProductStore
  ],
  imports: [
    TableModule,
    AutoCompleteModule,
    FormsModule,
    FormFieldComponent,
    CurrencyPipe,
    ProductLabelPipe,
    InputNumber,
    Button,
    Select,
    NgClass
  ]
})
export class PurchaseLinesComponent extends HasSubscriptionComponent implements OnInit {

  private readonly productQuickSearchService = inject(LocationProductQuickSearchService)
  private readonly purchaseFormContext = inject(PurchaseFormContext)
  private readonly purchaseService = inject(PurchaseService)

  readonly productsMap = this.productQuickSearchService.productsMap
  readonly productOptions = this.productQuickSearchService.productOptions
  readonly purchaseLinesArray = this.purchaseFormContext.purchaseLinesArray
  readonly purchaseLinesFieldTree = this.purchaseFormContext.purchaseForm.purchaseLines
  readonly isOrderedOrPartiallyDelivered = this.purchaseFormContext.isOrderedOrPartiallyDelivered
  readonly isDraftOrNew = this.purchaseFormContext.isDraftOrNew
  readonly editingRowKeys = this.purchaseFormContext.keysForLinesBeingEdited
  readonly isEditingLines = this.purchaseFormContext.isEditingLines
  private readonly linesBeingEdited = new Map<EntityId, PurchaseLineModel>()

  readonly searchTerm$ = new BehaviorSubject('')

  private readonly refetchProducts$ = this.searchTerm$.pipe(
    filter(Boolean),
    debounceTime(500),
    distinctUntilChanged(),
    tap((searchTerm) => {
      this.productQuickSearchService.fetchProducts(searchTerm)
    }),
    takeUntilDestroyed(this.destroyRef)
  )

  ngOnInit() {
    this.productQuickSearchService.fetchProducts('')
    this.refetchProducts$.subscribe()
  }

  initializeEditingLine(line: PurchaseLineModel) {
    this.editingRowKeys.update(keys => ({...keys, [line.locationProductId]: true}))
    this.linesBeingEdited.set(line.locationProductId, {...line})
  }

  cancelEditingLine(line: PurchaseLineModel) {
    const original = this.linesBeingEdited.get(line.locationProductId)
    if (original) {
      this.purchaseLinesFieldTree().value.update(lines =>
        lines.map(l => l.locationProductId === line.locationProductId ? original : l)
      )
    }
    this.removeLineFromEditing(line)
  }

  completeEditingLine(line: PurchaseLineModel) {
    const quantityExpected = line.quantityOrdered - (line.quantityCanceled ?? 0)
    const updated: PurchaseLineModel = {...line, quantityExpected, lineTotal: quantityExpected * line.unitCost}
    this.purchaseLinesFieldTree().value.update(lines =>
      lines.map(l => l.locationProductId === line.locationProductId ? updated : l)
    )
    this.purchaseLinesFieldTree().markAsDirty()
    this.removeLineFromEditing(line)
  }

  private removeLineFromEditing(line: PurchaseLineModel) {
    this.editingRowKeys.update(keys => {
      const {[line.locationProductId]: _, ...rest} = keys
      return rest
    })
    this.linesBeingEdited.delete(line.locationProductId)
  }

  addPurchaseLine(selectedProduct: EntityId) {
    if (!selectedProduct) return

    const product = this.productsMap().get(selectedProduct)
    const productAlreadyAdded = this.purchaseLinesArray().some(line => line.locationProductId === selectedProduct)
    if (product && !productAlreadyAdded) {
      const newLine: PurchaseLineModel = {
        id: '',
        referenceNumber: product.referenceNumber ?? '',
        locationProductId: product.id as string,
        quantityOrdered: 1,
        unitCost: 0,
        productGroupName: product.productGroupName ?? '',
        productName: product.productName ?? '',
        baseUnit: product.baseUnit ?? '',
        lineTotal: 0,
        quantityExpected: 1,
        quantityDelivered: 0,
        quantityCanceled: 0
      }
      this.purchaseLinesFieldTree().value.update(lines => [...lines, newLine])
      this.purchaseLinesFieldTree().markAsDirty()
      this.editingRowKeys.update(keys => ({...keys, [newLine.locationProductId]: true}))
    }
  }

  cancelLines() {
    const payload = this.purchaseFormContext.getSavableFormValue()
    const lines: PurchaseLineCancelDto[] = this.purchaseFormContext.purchaseLinesArray().map(line =>
      ({locationProductId: line.locationProductId, quantityCanceled: line.quantityCanceled})
    )
    if (payload.id && lines.length > 0) {
      this.purchaseService.cancelLines(payload.id as EntityId, lines)
    }
  }
}
