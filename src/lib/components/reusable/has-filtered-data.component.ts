import {Component, OnInit, signal} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {Observable} from 'rxjs'
import {HasSubscriptionComponent} from './has-subscription.component'

@Component({template: ''})
export abstract class HasFilteredDataComponent extends HasSubscriptionComponent implements OnInit {

  readonly showAdvancedFilter = signal(false)

  protected abstract readonly applyFilters$: Observable<unknown>

  ngOnInit() {
    this.applyFilters$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
  }

  toggleAdvancedFilter(show: boolean): void {
    this.showAdvancedFilter.set(show)
  }

}
