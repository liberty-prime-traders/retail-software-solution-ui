import {AsyncPipe} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {CategoryService} from '../../../api/category/category.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {HasGridComponent} from '../../reusable/has-grid.component'
import {CategoryFormComponent} from './category-form/category-form.component'

@Component({
  standalone: true,
  selector: 'rts-category',
  templateUrl: 'category.component.html',
  imports: [
    TableModule,
    AsyncPipe,
    NullSafePipe,
    Button,
    CategoryFormComponent,
    AddRowComponent,
    PrettifyEnumPipe
  ]
})
export class CategoryComponent extends HasGridComponent<CategoryService> {
  private readonly categoryService = inject(CategoryService)
  readonly loading$ = this.categoryService.selectLoading$()
  readonly processingIsUnderWay$ = this.categoryService.processingIsUnderWay$()
  readonly categories$ = this.categoryService.selectAll$()

  readonly apiService = this.categoryService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
}
