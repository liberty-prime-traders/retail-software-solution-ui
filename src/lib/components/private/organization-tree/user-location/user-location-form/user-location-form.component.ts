import {AsyncPipe, NgIf} from '@angular/common'
import {Component, inject, Input, input, OnInit, output} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {combineLatest, map, Observable} from 'rxjs'
import {SysUserService} from '../../../../../api/sys-user/sys-user.service'
import {UserLocationService} from '../../../../../api/user-location/user-location.service'
import {FullNamePipe} from '../../../../../utils/pipes/full-name.pipe'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {UserLocationAssignmentAction} from './user-location-assignment-action.enum'
import {UserLocationAssignmentContext} from './user-location-assignment-context'
import {UserLocationContextService} from './user-location-context.service'

@Component({
	standalone: true,
	selector: 'rts-user-location-form',
	templateUrl: 'user-location-form.component.html',
	styleUrls: [ 'user-location-form.component.scss'],
	providers: [UserLocationContextService],
	imports: [
		AsyncPipe,
		TableModule,
		FullNamePipe,
		FormButtonsComponent,
		NgIf,
		Button
	]
})
export class UserLocationFormComponent implements OnInit {
	
	private readonly userLocationContextService = inject(UserLocationContextService)
	private readonly sysUserService = inject(SysUserService)
	private readonly userLocationService = inject(UserLocationService)
	
	readonly allUsers$ = this.sysUserService.selectAll$()
	readonly loading$ = this.sysUserService.selectLoading$()
	readonly processingStatus$ = this.userLocationService.processingStatus$()
	readonly failureMessages$ = this.userLocationService.failureMessages$()
	
	readonly userAssignmentContexts$: Observable<Map<string, UserLocationAssignmentContext>> = combineLatest([
		this.allUsers$, this.userLocationContextService.userAssignmentChanged$
	]).pipe(
		map(([allUsers,]) =>
			this.userLocationContextService.getContext(allUsers.map(user => user.id!))
		)
	)
	
	@Input()
	set currentMembers(currentMembers: Set<string>) {
		this.userLocationContextService.initializeCurrentMembers(currentMembers)
	}
	
	readonly selectedLocation = input<string>()
	readonly closeForm = output()
	
	ngOnInit() {
		this.userLocationService.resetProcessingStatus()
		this.sysUserService.fetch()
	}
	
	modifyUserAssignment(userId: string, action: UserLocationAssignmentAction) {
		this.userLocationContextService.modifyUserAssignment(userId, action)
	}
	
	updateAssignment() {
		const updatedAssignments = this.userLocationContextService.getUpdatedAssignments()
		if (updatedAssignments.usersToRemove.length > 0 || updatedAssignments.usersToAdd.length > 0) {
			this.userLocationService.post({
				...updatedAssignments,
				locationId: this.selectedLocation()
			})
		} else {
			this.closeForm.emit()
		}
	}
	
	resetMembership() {
		this.userLocationContextService.resetMembership()
	}
}
