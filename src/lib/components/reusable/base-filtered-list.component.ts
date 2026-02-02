import {Component, OnInit, signal} from '@angular/core'
import {Observable} from 'rxjs'
import {HasSubscriptionComponent} from './has-subscription.component'

@Component({template: ''})
export abstract class BaseFilteredListComponent extends HasSubscriptionComponent implements OnInit {

  readonly showAdvancedFilter = signal(false)

  protected abstract readonly applyFilters$: Observable<unknown>

  ngOnInit() {
    this.subscriptions.add(this.applyFilters$.subscribe())
  }

  toggleAdvancedFilter(show: boolean): void {
    this.showAdvancedFilter.set(show)
  }

}
