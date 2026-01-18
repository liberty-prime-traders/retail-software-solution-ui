import {computed, inject, Injectable} from '@angular/core'
import {NonNullableFormBuilder, Validators} from '@angular/forms'
import {debounceTime, map, startWith} from 'rxjs'
import {ProductSearchService} from '../../../api/organization-level/product-search/product-search.service'
import {ProductStatus} from '../../../api/organization-level/product/product-status.enum'
import {ProductService} from '../../../api/organization-level/product/product.service'

@Injectable({providedIn: 'root'})
export class ProductDataService {
  private readonly productService = inject(ProductService)
  private readonly productSearchService = inject(ProductSearchService)
  private readonly formBuilder = inject(NonNullableFormBuilder)

  readonly products = this.productSearchService.selectAll

  readonly loading = computed(() =>
    this.productSearchService.selectLoading() || this.productService.selectLoading()
  )

  readonly filterForm = this.formBuilder.group({
    referenceNumber: [''],
    categoryIds: [[]],
    tagIds: [[]],
    statusList: [[ProductStatus.ACTIVE], [Validators.required]]
  })

  readonly filterFormChanges$ = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.value),
    debounceTime(1000),
  )

  readonly advancedFilterApplied$ = this.filterFormChanges$.pipe(
    map(() => {
      const referenceNumberPopulated = !!this.filterForm.get('referenceNumber')?.value
      const categoryIdsPopulated = (this.filterForm.get('categoryIds')?.value ?? []).length > 0
      const tagIdsPopulated = (this.filterForm.get('tagIds')?.value ?? []).length > 0
      const statusList = this.filterForm.get('statusList')?.value ?? []
      const statusListPopulated = statusList.length > 1
        || (statusList.length === 1 && statusList[0] !== ProductStatus.ACTIVE)

      return referenceNumberPopulated || categoryIdsPopulated || tagIdsPopulated || statusListPopulated
    })
  )

  applyFilters(searchText: string): null {
    if (this.filterForm.valid) {
      const filters = this.filterForm.value
      this.productSearchService.refetch({
        searchText: searchText,
        referenceNumber: filters.referenceNumber,
        categoryIds: filters.categoryIds,
        tagsIds: filters.tagIds,
        statusList: filters.statusList
      })
    }
    return null
  }
}
