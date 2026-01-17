import {computed, inject, Injectable, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {NonNullableFormBuilder, Validators} from '@angular/forms'
import {map} from 'rxjs'
import {ProductSearchService} from '../../../api/organization-level/product-search/product-search.service'
import {ProductStatus} from '../../../api/organization-level/product/product-status.enum'
import {ProductService} from '../../../api/organization-level/product/product.service'

@Injectable({providedIn: 'root'})
export class ProductDataService {
  private readonly productService = inject(ProductService)
  private readonly productSearchService = inject(ProductSearchService)
  private readonly formBuilder = inject(NonNullableFormBuilder)

  private readonly showAdvancedFilter = signal(false)
  readonly showingAdvancedFilter = this.showAdvancedFilter.asReadonly()

  readonly products = computed(() => {
    if (this.showAdvancedFilter()) {
      return this.productSearchService.selectAll()
    } else {
      return this.productService.selectAll()
    }
  })

  readonly loading = computed(() => {
    if (this.showAdvancedFilter()) {
      return this.productSearchService.selectLoading()
    } else {
      return this.productService.selectLoading()
    }
  })

  readonly filterForm = this.formBuilder.group({
    referenceNumber: [''],
    categoryIds: [[]],
    tagIds: [[]],
    statusList: [[ProductStatus.ACTIVE], [Validators.required]]
  })

  private readonly advancedFilterApplied$ = this.filterForm.valueChanges.pipe(
    map(() => {
      const referenceNumberPopulated = !!this.filterForm.get('referenceNumber')?.value
      const categoryIdsPopulated = (this.filterForm.get('categoryIds')?.value ?? []).length > 0
      const tagIdsPopulated = (this.filterForm.get('tagIds')?.value ?? []).length > 0
      const statusList = this.filterForm.get('statusList')?.value ?? []
      const statusListPopulated = statusList.length > 1 || statusList[0] !== ProductStatus.ACTIVE

      return referenceNumberPopulated || categoryIdsPopulated || tagIdsPopulated || statusListPopulated
    })
  )

  readonly advancedFilterApplied = toSignal(this.advancedFilterApplied$, {initialValue: false})

  resetFilters() {
    this.filterForm.reset()
  }

  applyFilters() {
    const filters = this.filterForm.value
    this.productSearchService.refetch({
      referenceNumber: filters.referenceNumber,
      categoryIds: filters.categoryIds,
      tagsIds: filters.tagIds,
      statusList: filters.statusList
    })
  }

  toggleAdvancedFilter(show: boolean) {
    this.showAdvancedFilter.set(show)
  }
}
