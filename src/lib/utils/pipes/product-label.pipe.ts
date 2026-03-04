import {Pipe, PipeTransform} from '@angular/core'
import {LocationProduct} from '../../api/location-level/location-product/location-product.model'

@Pipe({
  name: 'productLabel',
  standalone: true
})
export class ProductLabelPipe implements PipeTransform {
  transform(product: LocationProduct): string {
    return `${product.productGroupName} - ${product.productName} - ${product.referenceNumber}`
  }
}
