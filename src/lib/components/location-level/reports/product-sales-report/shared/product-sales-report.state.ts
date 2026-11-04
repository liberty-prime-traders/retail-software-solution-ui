import {computed, Injectable, signal} from '@angular/core'
import {ProductSalesRangeFormDefinition} from './product-sales-range-form.definition'

export interface ProductSalesProduct {
  locationProductId: string
  productName: string
  productGroupName: string
}

@Injectable({providedIn: 'root'})
export class ProductSalesReportState {
  static readonly MAX_COMPARED_PRODUCTS = 4

  /** Writable because the overview grid binds its checkbox selection straight to it. */
  readonly comparedProducts = signal<ProductSalesProduct[]>([])
  readonly comparedProductIds = computed(() => this.comparedProducts().map(product => product.locationProductId))
  readonly canCompareMoreProducts = computed(
    () => this.comparedProducts().length < ProductSalesReportState.MAX_COMPARED_PRODUCTS
  )

  readonly openedProduct = signal<ProductSalesProduct | null>(null)

  /** Owned by the report grid. The detail and compare pages copy it once when they open and never write back. */
  readonly reportRange = signal(ProductSalesRangeFormDefinition.createDefaultProductSalesRangeFormModel(1))

  addComparedProduct(product: ProductSalesProduct): void {
    this.comparedProducts.update(products =>
      this.canCompareMoreProducts()
        && !products.some(existing => existing.locationProductId === product.locationProductId)
        ? [...products, product]
        : products
    )
  }

  removeComparedProduct(locationProductId: string): void {
    this.comparedProducts.update(
      products => products.filter(product => product.locationProductId !== locationProductId)
    )
  }

  clearComparedProducts(): void {
    this.comparedProducts.set([])
  }

  openProduct(product: ProductSalesProduct): void {
    this.openedProduct.set(product)
  }
}
