import {Pipe, PipeTransform} from '@angular/core'
import {ProductSalesProduct} from '../shared/product-sales-report.state'

@Pipe({name: 'productSelectionLocked', standalone: true})
export class ProductSelectionLockedPipe implements PipeTransform {
  transform(row: ProductSalesProduct, selectedProducts: ProductSalesProduct[], maxSelected: number): boolean {
    return selectedProducts.length >= maxSelected
      && !selectedProducts.some(selected => selected.locationProductId === row.locationProductId)
  }
}
