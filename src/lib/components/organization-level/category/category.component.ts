import {Component, inject, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {CategoryService} from '../../../api/category/category.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasEditableGridComponent} from '../../reusable/has-editable-grid.component'
import {CategoryFormComponent} from './category-form/category-form.component'

@Component({
  selector: 'rts-category',
  templateUrl: 'category.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    CategoryFormComponent,
    AddRowComponent,
    PrettifyEnumPipe,
    GridFilterComponent
  ]
})
export class CategoryComponent extends HasEditableGridComponent<CategoryService> {
  private readonly categoryService = inject(CategoryService)
  readonly loading = this.categoryService.selectLoading
  readonly categories = this.categoryService.selectAll

  readonly apiService = this.categoryService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
}
