import {Component, inject, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {CategoryService} from '../../../api/organization-level/category/category.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
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
    AddRowComponent,
    PrettifyEnumPipe,
    GridFilterComponent,
    EmptyRowComponent
  ]
})
export class CategoryComponent extends GridWithAddButtonComponent<CategoryService> {
  private readonly categoryService = inject(CategoryService)
  readonly loading = this.categoryService.selectLoading
  readonly categories = this.categoryService.selectAll

  readonly apiService = this.categoryService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
}
