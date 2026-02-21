import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, signal} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {TagService} from '../../../api/organization-level/tag/tag.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {CategoryType} from '../../../api/organization-level/tag/category-type.enum'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {TagFormComponent} from './tag-form/tag-form.component'

@Component({
  selector: 'rts-tag',
  templateUrl: 'tag.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    TagFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    Divider,
    ReactiveFormsModule,
    NgClass,
    NgTemplateOutlet,
    PrettifyEnumPipe
  ]
})
export class TagComponent extends GridWithAddButtonComponent<TagService> {
  private readonly tagService = inject(TagService)
  readonly apiService = this.tagService

  readonly selectedCategory = signal<CategoryType | undefined>(CategoryType.PRODUCT)
  readonly selectedCategoryStash = signal<CategoryType | undefined>(undefined)
  readonly tags = computed(() => this.tagService.selectAll().filter(
    tag => tag.category === this.selectedCategory())
  )

  readonly CATEGORY_TYPES = Object.values(CategoryType)

  selectCategory(category: CategoryType) {
    this.selectedCategory.set(category)
    this.addingIsActive.set(false)
  }

  override setAddingActiveTrue() {
    this.addingIsActive.set(true)
    this.selectedCategoryStash.set(this.selectedCategory())
    this.selectedCategory.set(undefined)
  }

  override setAddingActiveFalse() {
    this.addingIsActive.set(false)
    this.selectedCategory.set(this.selectedCategoryStash())
  }

  override successfulSave() {
    this.setAddingActiveFalse()
    this.selectedCategory.set(this.tagService.lastSavedResponse()?.category)
  }
}
