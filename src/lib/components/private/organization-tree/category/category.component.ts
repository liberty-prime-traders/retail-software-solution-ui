import {AsyncPipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {isNil, sortBy} from 'lodash-es'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {delay, filter, Subscription} from 'rxjs'
import {first, tap} from 'rxjs/operators'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {CategoryService} from '../../../../api/category/category.service'
import {Category} from '../../../../api/category/category.model'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {CategoryFormComponent} from './category-form/category-form.component'

@Component({
  standalone: true,
  selector: 'rts-category',
  templateUrl: 'category.component.html',
  imports: [
    TableModule,
    AsyncPipe,
    NullishToZeroPipe,
    NullSafePipe,
    Button,
    AddRowComponent,
    PrettifyEnumPipe,
    CategoryFormComponent
  ]
})
export class CategoryComponent extends HasSubscriptionComponent implements OnInit {
  private readonly categoryService = inject(CategoryService)
  readonly loading$ = this.categoryService.selectLoading$()
  readonly processingIsUnderWay$ = this.categoryService.processingIsUnderWay$()
  readonly categories$ = this.categoryService.selectAll$()
  selectedCategory = model<Category|undefined>(undefined)

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)

  ngOnInit() {
    this.categoryService.fetch()
    this.subscriptions.add(this.listenToCategorySaveStatus())
    this.subscriptions.add(this.selectCategoryOnInitialLoad())
  }

  private listenToCategorySaveStatus(): Subscription {
    return this.categoryService.processingStatus$().pipe(
      filter(status => status === ProcessingStatus.SUCCESS),
      delay(500),
      tap(() => this.addingIsActive.set(false))
    )
      .subscribe()
  }

  private selectCategoryOnInitialLoad(): Subscription {
    return this.categoryService.selectAll$().pipe(
      filter(categories => !isNil(categories) && categories.length > 0),
      first(),
      tap(categories => this.selectedCategory.set(sortBy(categories, ['category_name']).at(0)))
    )
      .subscribe()
  }
}
