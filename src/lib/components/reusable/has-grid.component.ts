import {Component, OnInit, WritableSignal} from '@angular/core'
import {delay, Subscription} from 'rxjs'
import {filter, tap} from 'rxjs/operators'
import {BaseService} from '../../api/base-api/base.service'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {HasSubscriptionComponent} from './has-subscription.component'

@Component({template: ''})
export abstract class HasGridComponent<SERVICE extends BaseService<any, any>>
  extends HasSubscriptionComponent implements OnInit{
	abstract readonly apiService: SERVICE
	abstract readonly addingIsActive: WritableSignal<boolean>
	abstract readonly rowIsExpanded: WritableSignal<boolean>
	
	protected readonly fetchByDefault: boolean = true

	ngOnInit() {
	  if (this.fetchByDefault) {
		  this.apiService.fetch()
	  }
	  this.subscriptions.add(this.listenToSaveStatus())
	}

	private listenToSaveStatus(): Subscription {
	  return this.apiService.processingStatus$().pipe(
	    filter(status => status === ProcessingStatus.SUCCESS),
	    delay(500),
	    tap(() => this.closeAddRow())
	  )
	    .subscribe()
	}

	closeAddRow() {
	  this.addingIsActive.set(false)
	  this.rowIsExpanded.set(false)
	}
}
