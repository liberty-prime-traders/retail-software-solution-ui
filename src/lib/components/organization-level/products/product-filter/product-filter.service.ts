import {computed, effect, inject, Injectable, signal} from '@angular/core'
import {NonNullableFormBuilder, Validators} from '@angular/forms'
import {debounceTime, map, of, startWith, switchMap} from 'rxjs'
import {ProductGroupService} from '../../../../api/organization-level/product-group/product-group.service'
import {ProductSearchService} from '../../../../api/organization-level/product-search/product-search.service'
import {ProductStatus} from '../../../../api/organization-level/product/product-status.enum'
import {Product} from '../../../../api/organization-level/product/product.model'

@Injectable({providedIn: 'root'})
export class ProductFilterService {
  private readonly productSearchService = inject(ProductSearchService)
  private readonly productGroupService = inject(ProductGroupService)
  private readonly formBuilder = inject(NonNullableFormBuilder)
  readonly requireClientSideFilter = this.productSearchService.requireClientSideFilter
  private readonly clientSideFilteredProducts = signal<Product[]>([])

  readonly filteredProducts = computed(() => {
    if (this.requireClientSideFilter()) {
      return this.clientSideFilteredProducts()
    }
    return this.productSearchService.selectAll()
  })

  readonly filterForm = this.formBuilder.group({
    searchText: [''],
    referenceNumber: [''],
    categoryIds: [[]],
    tagIds: [[]],
    statusList: [[ProductStatus.ACTIVE], [Validators.required]]
  })

  private readonly filterFormChanges$ = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.value),
    debounceTime(1000),
  )

  readonly applyFilters$ = this.filterFormChanges$.pipe(
    switchMap(() => {
      if (this.requireClientSideFilter()) {
        return of(this.reloadClientSideFilteredProducts())
      }
      return of(this.applyServerSideFilters())
    })
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

  readonly $clientSideFilterEffect = effect(() => {
    if (this.requireClientSideFilter()) {
      this.reloadClientSideFilteredProducts()
    }
  })

  resetFilters(): void {
    this.filterForm.reset()
  }

  private applyServerSideFilters(): null {
    if (this.filterForm.valid) {
      this.productSearchService.refetch(this.filterForm.value)
    }
    return null
  }

  private reloadClientSideFilteredProducts(): null {
    const allProducts = this.productSearchService.selectAll()
    const filteredProducts = allProducts.filter(product => this.passesClientSideFilters(product))
    this.clientSideFilteredProducts.set(filteredProducts)
    return null
  }

  private passesClientSideFilters(product: Product): boolean {
    if (!this.matchesSearchText(product)) {
      return false;
    }

    if (this.filterForm.valid) {
      return (
        this.matchesReferenceNumber(product) &&
        this.belongsToSelectedCategories(product) &&
        this.hasAllSelectedTags(product) &&
        this.matchesSelectedStatus(product)
      );
    }

    return true;
  }

  private matchesSearchText(product: Product): boolean {
    const searchText = this.filterForm.value.searchText?.trim().toLowerCase()
    if (!searchText) return true

    return product.productName?.toLowerCase().includes(searchText) ||
      product.referenceNumber?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText) ||
      product.productGroupName?.toLowerCase().includes(searchText) ||
      false
  }

  private matchesReferenceNumber(product: Product): boolean {
    const referenceNumberFilter = this.filterForm.value.referenceNumber?.trim()
    if (!referenceNumberFilter) return true

    return product.referenceNumber?.toLowerCase().includes(referenceNumberFilter.toLowerCase()) ?? false
  }

  private belongsToSelectedCategories(product: Product): boolean {
    const selectedCategoryIds = new Set(this.filterForm.value.categoryIds ?? [])
    if (selectedCategoryIds.size === 0) return true

    const allowedProductGroupIds = new Set(this.getProductGroupIdsForCategories(selectedCategoryIds))
    return product.productGroupId ? allowedProductGroupIds.has(product.productGroupId) : false
  }

  private getProductGroupIdsForCategories(categoryIds: Set<string>): string[] {
    return this.productGroupService.selectAll()
      .filter(pg => pg.categoryId && categoryIds.has(pg.categoryId))
      .map(pg => String(pg.id))
  }

  private hasAllSelectedTags(product: Product): boolean {
    const selectedTagIds =  (this.filterForm.value.tagIds ?? []) as string[]
    if (selectedTagIds.length === 0) return true

    const productTagIds = new Set(product.activeTags?.map(tag => String(tag.id)) ?? [])
    return selectedTagIds.every(tagId => productTagIds.has(tagId))
  }

  private matchesSelectedStatus(product: Product): boolean {
    const selectedStatuses = new Set((this.filterForm.value.statusList ?? []))
    if (selectedStatuses.size === 0) return true
    if (!product.status) return false

    return selectedStatuses.has(product.status)
  }

}
