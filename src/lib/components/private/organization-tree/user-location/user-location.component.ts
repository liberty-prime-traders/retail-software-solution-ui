import {AsyncPipe, DatePipe} from '@angular/common'
import {Component, computed, inject, input, OnInit, signal} from '@angular/core'
import {isNil} from 'lodash-es'
import {TableModule} from 'primeng/table'
import {delay, filter, map, Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {UserLocationQuery} from '../../../../api/user-location/user-location.query'
import {UserLocationService} from '../../../../api/user-location/user-location.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PropExtractorPipe} from '../../../../utils/pipes/prop-extractor.pipe'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {UserLocationFormComponent} from './user-location-form/user-location-form.component'

@Component({
	selector: 'rts-user-location',
	standalone: true,
	templateUrl: 'user-location.component.html',
	imports: [
		AddRowComponent,
		AsyncPipe,
		NullSafePipe,
		TableModule,
		DatePipe,
		UserLocationFormComponent,
		PropExtractorPipe
	]
})
export class UserLocationComponent extends HasSubscriptionComponent implements OnInit {
	private readonly userLocationService = inject(UserLocationService)
	private readonly userLocationQuery = inject(UserLocationQuery)
	
	readonly loading$ = this.userLocationService.selectLoading$()
	
	readonly selectedLocation = input<string>()
	
	readonly usersAtLocation = computed(() =>
		this.userLocationQuery.selectUsersForLocation(this.selectedLocation())
	)
	
	readonly activeUsersAtLocation = computed(() =>
		this.usersAtLocation().pipe(
			map(users => users.filter(user => isNil(user.endOn)))
		)
	)
	
	readonly assignmentAdjustmentIsActive = signal(false)
	
	ngOnInit() {
		this.userLocationService.fetch()
		this.subscriptions.add(this.listenToOrganizationSaveStatus())
	}
	
	private listenToOrganizationSaveStatus(): Subscription {
		return this.userLocationService.processingStatus$().pipe(
			filter(status => status === ProcessingStatus.SUCCESS),
			delay(500),
			tap(() => this.assignmentAdjustmentIsActive.set(false))
		)
			.subscribe()
	}
}
