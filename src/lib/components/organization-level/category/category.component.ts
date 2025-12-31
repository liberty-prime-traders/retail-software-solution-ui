import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {CategoryType} from '../../../api/organization-level/category/category-type.enum'
import {CategoryService} from '../../../api/organization-level/category/category.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {CategoryFormComponent} from './category-form/category-form.component'

@Component({
  selector: 'rts-category',
  templateUrl: 'category.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    CategoryFormComponent,
    PrettifyEnumPipe,
    GridFilterComponent,
    EmptyRowComponent,
    Divider,
    ReactiveFormsModule,
    NgClass,
    NgTemplateOutlet
  ]
})
export class CategoryComponent extends GridWithAddButtonComponent<CategoryService> {
  private readonly categoryService = inject(CategoryService)
  readonly apiService = this.categoryService

  readonly selectedCategory = signal<CategoryType | undefined>(undefined)
  readonly selectedCategoryStash = signal<CategoryType | undefined>(undefined)
  readonly categories = computed(() => this.categoryService.selectAll().filter(
    cat => cat.categoryType === this.selectedCategory())
  )

  readonly CATEGORY_TYPES = Object.values(CategoryType)

  selectCategory(categoryType: CategoryType) {
    this.selectedCategory.set(categoryType)
    this.addingIsActive.set(false)
  }

  setAddingActiveTrue() {
    this.addingIsActive.set(true)
    this.selectedCategoryStash.set(this.selectedCategory())
    this.selectedCategory.set(undefined)
  }

  setAddingActiveFalse() {
    this.addingIsActive.set(false)
    this.selectedCategory.set(this.selectedCategoryStash())
  }

  successfulSave() {
    this.setAddingActiveFalse()
    this.selectedCategory.set(this.categoryService.lastSavedResponse()?.categoryType)
  }
}
