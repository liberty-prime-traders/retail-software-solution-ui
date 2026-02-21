import {Component, DestroyRef, inject, OnDestroy} from '@angular/core'
import {Subscription} from 'rxjs'

@Component({
  template: ''
})
export abstract class HasSubscriptionComponent implements OnDestroy {
  protected readonly subscriptions = new Subscription()
  protected readonly destroyRef = inject(DestroyRef)

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
