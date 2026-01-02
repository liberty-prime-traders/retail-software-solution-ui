import {Component, inject, OnInit} from '@angular/core'
import {FormsModule, NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {InputText} from 'primeng/inputtext'
import {MultiSelect} from 'primeng/multiselect'
import {CategoryService} from '../../../../api/organization-level/category/category.service'
import {TagService} from '../../../../api/organization-level/tag/tag.service'
import {FormFieldDirection} from '../../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-product-filter',
  templateUrl: './product-filter.component.html',
  imports: [
    FormFieldComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    MultiSelect,
    Button
  ]
})
export class ProductFilterComponent implements OnInit {

  private readonly formBuilder = inject(NonNullableFormBuilder)
  private readonly tagService = inject(TagService)
  private readonly categoryService = inject(CategoryService)

  readonly productTags = this.tagService.productTags
  readonly productCategories = this.categoryService.productCategories

  readonly FormFieldDirection = FormFieldDirection

  readonly filterForm = this.formBuilder.group({
    productName: [''],
    referenceNumber: [''],
    description: [''],
    categoryIds: [[]],
    tagIds: [[]]
  })

  ngOnInit() {
    this.tagService.fetch()
    this.categoryService.fetch()
  }

  resetFilters() {
    this.filterForm.reset()
  }

  applyFilters() {
    const filters = this.filterForm.value
  }
}
