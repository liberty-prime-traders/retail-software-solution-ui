import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject, OnInit, signal} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {FormsModule} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {AutoCompleteModule} from 'primeng/autocomplete'
import {Button} from 'primeng/button'
import {InputNumber} from 'primeng/inputnumber'
import {TableModule} from 'primeng/table'
import {BehaviorSubject, debounceTime, distinctUntilChanged, filter} from 'rxjs'
import {tap} from 'rxjs/operators'
import {
  LocationProductQuickSearchService
} from '../../../../../api/location-level/location-product/location-product-quick-search.service'
import {LocationProduct} from '../../../../../api/location-level/location-product/location-product.model'
import {LocationProductStore} from '../../../../../api/location-level/location-product/location-product.store'
import {ProductLabelPipe} from '../../../../../utils/pipes/product-label.pipe'
import {SelectItem, toSelectItems} from '../../../../../utils/types/select-item.type'
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
    Button
  ]
})
export class PurchaseLinesComponent extends HasSubscriptionComponent implements OnInit {

  private readonly productQuickSearchService = inject(LocationProductQuickSearchService)
  private readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly products = computed(() => this.productQuickSearchService.selectAll())
  private readonly purchaseLines = this.purchaseFormContext.purchaseLines
  readonly purchaseLinesArray = computed(() => Array.from(this.purchaseLines().values()))

  private readonly purchaseLinesBeingEdited = signal(new Map<EntityId, PurchaseLineModel>)

  readonly editingRowKeys = computed(() => {
    const result: { [s: string]: boolean} = {}
    Array.from(this.purchaseLinesBeingEdited().keys()).map((key) => result[`${key}`] = true)
    return result as { [s: string]: boolean}
  })

  readonly productsMap = computed(() => {
    const map = new Map<EntityId, LocationProduct>()
    this.products().forEach(product => map.set(product.id, product))
    return map
  })

  readonly productOptions = computed(() => {
    return toSelectItems(this.products(), {
      itemValueBy: this.extractValueFromProduct,
      itemLabelBy: this.extractLabelFromProduct
    })
  })

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

  private readonly extractLabelFromProduct = (product: LocationProduct): string => {
    return ProductLabelPipe.prototype.transform(product)
  }

  private readonly extractValueFromProduct = (product: LocationProduct): EntityId => {
    return product.id as EntityId
  }

  initEditingLine(line: PurchaseLineModel) {
    this.patchLinesBeingEdited(line)
  }

  cancelEditingLine(line: PurchaseLineModel) {
    const originalLine = this.purchaseLinesBeingEdited().get(line.locationProductId)
    if (originalLine) {
      this.patchPurchaseLines(originalLine)
    }
  }

  completeEditingLine(line: PurchaseLineModel) {
    line.lineTotal = line.quantityOrdered * line.unitCost
    this.patchPurchaseLines(line)
  }

  addPurchaseLine(selectedProduct: SelectItem<EntityId>) {
    const product = this.productsMap().get(selectedProduct?.value)
    if (product && !this.purchaseLines().has(product.id)) {
      const newLine: PurchaseLineModel = {
        id: '',
        referenceNumber: product.referenceNumber ?? '',
        locationProductId: product.id as string,
        quantityOrdered: 1,
        unitCost: 0,
        productGroupName: product.productGroupName ?? '',
        productName: product.productName ?? '',
        baseUnit: product.baseUnit ?? '',
        lineTotal: 0
      }
      this.patchPurchaseLines(newLine)
      this.patchLinesBeingEdited(newLine)
    }
  }

  private patchPurchaseLines(line: PurchaseLineModel) {
    const currentLines = new Map(this.purchaseLines())
    currentLines.set(line.locationProductId, line)
    this.purchaseLinesBeingEdited().delete(line.locationProductId)
    this.purchaseLinesBeingEdited().forEach((editedLine, key) => currentLines.set(key, editedLine))
    this.purchaseLines.set(currentLines)
    const orderTotal = this.purchaseLinesArray().reduce(
      (total, line) => total + line.lineTotal, 0
    )
    this.purchaseFormContext.patchFormValue(this.purchaseLinesArray(), orderTotal)
  }

  private patchLinesBeingEdited(line: PurchaseLineModel) {
    const currentLinesBeingEdited = new Map(this.purchaseLinesBeingEdited())
    currentLinesBeingEdited.set(line.locationProductId, line)
    this.purchaseLinesBeingEdited.set(currentLinesBeingEdited)
  }
}
