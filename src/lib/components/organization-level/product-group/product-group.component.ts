import {NgClass} from '@angular/common'
import {Component, inject, model, OnInit} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {ProductGroup} from '../../../api/organization-level/product-group/product-group.model'
import {ProductGroupService} from '../../../api/organization-level/product-group/product-group.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {ProductGroupFormComponent} from './product-group-form/product-group-form.component'

@Component({
  selector: 'rts-product-group',
  templateUrl: 'product-group.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    ProductGroupFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    AutoStretchDirective
  ]
})
export class ProductGroupComponent extends GridWithAddButtonComponent<ProductGroupService> implements OnInit {
  private readonly productGroupService = inject(ProductGroupService)
  readonly apiService = this.productGroupService

  readonly productGroups = this.productGroupService.selectAll
  readonly selectedProductGroup = model<ProductGroup|undefined>(undefined)
}
