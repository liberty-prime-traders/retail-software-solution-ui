import {Component, inject, model, OnInit} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {Checkbox} from 'primeng/checkbox'
import {InputText} from 'primeng/inputtext'
import {MultiSelect} from 'primeng/multiselect'
import {CategoryService} from '../../../../api/organization-level/category/category.service'
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
    Checkbox
  ]
})
export class ProductFilterComponent implements OnInit {

  private readonly tagService = inject(TagService)
  private readonly categoryService = inject(CategoryService)
  readonly productFilterService = inject(ProductFilterService)

  readonly productTags = this.tagService.productTags
  readonly productCategories = this.categoryService.productCategories

  readonly FormFieldDirection = FormFieldDirection
  readonly ProductStatus = ProductStatus

  readonly statuses = model([ProductStatus.ACTIVE])

  ngOnInit() {
    this.tagService.fetch()
    this.categoryService.fetch()
  }

}
