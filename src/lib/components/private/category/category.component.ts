import {AsyncPipe, DatePipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {delay, filter, Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {CategoryFormComponent} from './category-form/category-form.component'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {CategoryService} from '../../../api/category/category.service'
import {Category} from '../../../api/category/category.model'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'

@Component({
  standalone: true,
  selector: 'rts-category',
  templateUrl: 'category.component.html',
  imports: [
    TableModule,
    AsyncPipe,
    NullSafePipe,
    DatePipe,
    Button,
    CategoryFormComponent,
    AddRowComponent
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
  }

  private listenToCategorySaveStatus(): Subscription {
    return this.categoryService.processingStatus$().pipe(
      filter(status => status === ProcessingStatus.SUCCESS),
      delay(500),
      tap(() => this.addingIsActive.set(false))
    )
      .subscribe()
  }
}
