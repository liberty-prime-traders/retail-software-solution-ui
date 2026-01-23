import {Component, computed, inject, model, OnInit} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Checkbox} from 'primeng/checkbox'
import {InputText} from 'primeng/inputtext'
import {MultiSelect} from 'primeng/multiselect'
import {ProductCategoryService} from '../../../../api/organization-level/product-category/product-category.service'
import {ProductGroupService} from '../../../../api/organization-level/product-group/product-group.service'
import {ProductStatus} from '../../../../api/organization-level/product/product-status.enum'
import {TagService} from '../../../../api/organization-level/tag/tag.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {FormFieldDirection} from '../../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {ProductFilterService} from './product-filter.service'

@Component({
  selector: 'rts-product-filter',
  templateUrl: './product-filter.component.html',
  imports: [
    FormFieldComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    MultiSelect,
    EnumToDropdownPipe,
    Checkbox,
    Button
  ]
})
export class ProductFilterComponent implements OnInit {
  private readonly productGroupService = inject(ProductGroupService)
  private readonly tagService = inject(TagService)
  private readonly productCategoryService = inject(ProductCategoryService)
  readonly productFilterService = inject(ProductFilterService)

  readonly productTags = this.tagService.productTags
  readonly productCategories = this.productCategoryService.selectAll

  readonly referenceNumberPlaceholder = computed(() =>
    this.productFilterService.requireClientSideFilter() ? 'Contains ...' : 'Starts with...'
  )
  readonly FormFieldDirection = FormFieldDirection
  readonly ProductStatus = ProductStatus

  readonly statuses = model([ProductStatus.ACTIVE])

  ngOnInit() {
    this.tagService.fetch()
    this.productCategoryService.fetch()
    this.productGroupService.fetch()
  }

}
