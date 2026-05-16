import {Pipe, PipeTransform} from '@angular/core'
import {ProductCore} from '../../api/cross-tier/product/product-core.model'

@Pipe({
  name: 'productLabel',
  standalone: true
})
export class ProductLabelPipe implements PipeTransform {
  transform(product: ProductCore): string {
    return `${product.productGroupName} - ${product.productName} - ${product.referenceNumber}`
  }
}
