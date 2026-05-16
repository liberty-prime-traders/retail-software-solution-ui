import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Checkbox} from 'primeng/checkbox'
import {InputText} from 'primeng/inputtext'
import {MultiSelect} from 'primeng/multiselect'
import {ProductDetail} from '../../../../api/cross-tier/product/product-detail.model'
import {ProductCategoryService} from '../../../../api/organization-level/product-category/product-category.service'
import {ProductGroupService} from '../../../../api/organization-level/product-group/product-group.service'
import {ProductStatus} from '../../../../api/cross-tier/product/product-status.enum'
import {TagService} from '../../../../api/organization-level/tag/tag.service'
import {SchemaLevel} from '../../../../api/platform-level/table-registry/schema-level.enum'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {ProductFilterService} from '../product-filter.service'

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
export class ProductFilterComponent<PRODUCT extends ProductDetail> implements OnInit {
  private readonly productCategoryService = inject(ProductCategoryService)
  private readonly productGroupService = inject(ProductGroupService)
  private readonly tagService = inject(TagService)
  readonly productFilterService: ProductFilterService<PRODUCT> = inject(ProductFilterService<PRODUCT>)

  readonly schemaLevel = input.required<SchemaLevel>()

  readonly FormFieldDirection = FormFieldLayout
  readonly ProductStatus = ProductStatus
  readonly SchemaLevel = SchemaLevel

  readonly productCategories = this.productCategoryService.selectAll
  readonly productTags = this.tagService.productTags

  readonly referenceNumberPlaceholder = computed(() =>
    this.productFilterService.requireClientSideFilter() ? 'Contains ...' : 'Starts with...'
  )

  ngOnInit() {
    this.tagService.fetch()
    this.productCategoryService.fetch()
    this.productGroupService.fetch()
  }
}
