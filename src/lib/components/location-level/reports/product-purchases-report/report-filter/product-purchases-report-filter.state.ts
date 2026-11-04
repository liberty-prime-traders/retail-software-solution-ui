import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {form} from '@angular/forms/signals'
import {ProductCategoryService} from '../../../../../api/organization-level/product-category/product-category.service'
import {ContactService} from '../../../../../api/organization-level/contact/contact.service'
import {ProductPurchasesReportService} from '../../../../../api/location-level/product-purchases-report/product-purchases-report.service'
import {ProductCore} from '../../../../../api/cross-tier/product/product-core.model'
import {ZonedDatesService} from '../../../../../utils/services/zoned-dates.service'
import {debouncedSignal} from '../../../../../utils/signals'
import {ProductPurchasesReportFormDefinition} from './product-purchases-report-form.definition'

const FILTER_DEBOUNCE_IN_MS = 500

@Injectable()
export class ProductPurchasesReportFilterState {
  private readonly contactService = inject(ContactService)
  private readonly productCategoryService = inject(ProductCategoryService)
  private readonly productPurchasesReportService = inject(ProductPurchasesReportService)
  private readonly zonedDatesService = inject(ZonedDatesService)

  readonly suppliers = this.contactService.suppliers
  readonly categories = this.productCategoryService.selectAll

  readonly filterFormValue = signal(ProductPurchasesReportFormDefinition.createDefaultFormModel())
  readonly filterForm = form(this.filterFormValue, ProductPurchasesReportFormDefinition.productPurchasesReportFormSchema)

  // Chips show names, so the names are kept as products and suppliers are picked, not looked up later.
  private readonly productNamesById = signal(new Map<string, string>())

  readonly selectedProducts = computed(() =>
    this.filterFormValue().locationProductIds.map(id => ({id, name: this.productNamesById().get(id) ?? id}))
  )

  readonly categoryNamesById = computed(() =>
    new Map(this.categories().map(category => [category.id, category.categoryName]))
  )

  readonly selectedCategories = computed(() =>
    this.filterFormValue().categoryIds.map(id => ({id, name: this.categoryNamesById().get(id) ?? id}))
  )

  readonly supplierNamesById = computed(() =>
    new Map(this.suppliers().map(supplier => [supplier.id, supplier.fullName]))
  )

  readonly selectedSuppliers = computed(() =>
    this.filterFormValue().supplierIds.map(id => ({id, name: this.supplierNamesById().get(id) ?? id}))
  )

  private readonly debouncedFilterFormValue = debouncedSignal(this.filterFormValue, FILTER_DEBOUNCE_IN_MS)

  readonly reportParameters = computed(() =>
    ProductPurchasesReportFormDefinition.convertToReportParameters(
      this.debouncedFilterFormValue(),
      this.zonedDatesService
    )
  )

  readonly deliveryLinesParameters = computed(() =>
    ProductPurchasesReportFormDefinition.convertToDeliveryLinesParameters(
      this.debouncedFilterFormValue(),
      this.zonedDatesService
    )
  )

  private readonly refetchOnFilterChange = effect(() => {
    const reportParameters = this.reportParameters()
    untracked(() => {
      if (reportParameters) {
        this.productPurchasesReportService.load(reportParameters)
      }
    })
  })

  constructor() {
    this.contactService.fetch()
    this.productCategoryService.fetch()
  }

  addLocationProduct(product: ProductCore) {
    const locationProductIds = this.filterForm.locationProductIds().value
    if (locationProductIds().includes(String(product.id))) {
      return
    }
    this.productNamesById.update(names => new Map(names).set(String(product.id), product.productName))
    locationProductIds.set([...locationProductIds(), String(product.id)])
  }

  removeLocationProduct(locationProductId: string) {
    const locationProductIds = this.filterForm.locationProductIds().value
    locationProductIds.set(locationProductIds().filter(id => id !== locationProductId))
  }

  addSupplier(supplierId: string | null) {
    const supplierIds = this.filterForm.supplierIds().value
    if (!supplierId || supplierIds().includes(supplierId)) {
      return
    }
    supplierIds.set([...supplierIds(), supplierId])
  }

  removeSupplier(supplierId: string) {
    const supplierIds = this.filterForm.supplierIds().value
    supplierIds.set(supplierIds().filter(id => id !== supplierId))
  }

  addCategory(categoryId: string | null) {
    const categoryIds = this.filterForm.categoryIds().value
    if (!categoryId || categoryIds().includes(categoryId)) {
      return
    }
    categoryIds.set([...categoryIds(), categoryId])
  }

  removeCategory(categoryId: string) {
    const categoryIds = this.filterForm.categoryIds().value
    categoryIds.set(categoryIds().filter(id => id !== categoryId))
  }

  resetFilters() {
    this.filterFormValue.set(ProductPurchasesReportFormDefinition.createDefaultFormModel())
  }
}
