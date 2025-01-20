import {Injectable, signal} from '@angular/core'
import {BehaviorSubject} from 'rxjs'
import {getIcon, getSeverity, UserLocationAssignmentAction} from './user-location-assignment-action.enum'
import {UserLocationAssignmentContext} from './user-location-assignment-context'

@Injectable()
export class UserLocationContextService {
	
	readonly userAssignmentChanged$ = new BehaviorSubject(false)
	
	private readonly currentMembers = signal<Set<string>>(new Set())
	private readonly usersToAdd = signal<Set<string>>(new Set())
	private readonly usersToRemove = signal<Set<string>>(new Set())
	
	initializeCurrentMembers(currentMembers?: Set<string>) {
		this.currentMembers.set(new Set(Array.from(currentMembers ?? [])))
	}
	
	modifyUserAssignment(userId: string, action: UserLocationAssignmentAction) {
		switch (action) {
			case UserLocationAssignmentAction.ADD: this.slateUserForAddition(userId)
				break
			case UserLocationAssignmentAction.REMOVE:this.slateUserForRemoval(userId)
		}
	}
	
	getUpdatedAssignments() {
		return {
			usersToAdd: Array.from(this.usersToAdd()),
			usersToRemove: Array.from(this.usersToRemove())
		}
	}
	
	resetMembership() {
		this.usersToAdd.set(new Set())
		this.usersToRemove.set(new Set())
		this.notifyOfChanges()
	}
	
	private slateUserForAddition(userId: string) {
		if (!this.currentMembers().has(userId)) {
			this.usersToAdd.update(current => current.add(userId))
		}
		if (this.usersToRemove().has(userId)) {
			this.usersToRemove.update(current => {
				current.delete(userId)
				return current
			})
		}
		this.notifyOfChanges()
	}
	
	private notifyOfChanges() {
		this.userAssignmentChanged$.next(!this.userAssignmentChanged$.value)
	}
	
	private slateUserForRemoval(userId: string) {
		if (this.currentMembers().has(userId)) {
			this.usersToRemove.update(current => current.add(userId))
		}
		this.usersToAdd.update(current => {
			current.delete(userId)
			return current
		})
		this.notifyOfChanges()
	}
	
	getContext(userIds: string[]): Map<string, UserLocationAssignmentContext> {
		const result = new Map<string, UserLocationAssignmentContext>()
		userIds.forEach(userId => result.set(userId, this.getUserContext(userId)))
		return result
	}
	
	private getUserContext(userId: string): UserLocationAssignmentContext {
		const action = this.getAssignmentAction(userId)
		return {
			action,
			comment: this.getComment(userId),
			icon: getIcon(action),
			severity: getSeverity(action)
		}
	}
	
	private getAssignmentAction(userId: string): UserLocationAssignmentAction {
		if (this.canBeRemoved(userId)) {
			return UserLocationAssignmentAction.REMOVE
		}
		return UserLocationAssignmentAction.ADD
	}
	
	private canBeRemoved(userId: string): boolean {
		return (this.currentMembers().has(userId) && !this.usersToRemove().has(userId)) || this.usersToAdd().has(userId)
	}

	private getComment(userId: string): string {
		if (this.usersToRemove().has(userId)) {
			return 'User is selected for removal'
		}
		if (this.currentMembers().has(userId)) {
			return 'User is already a member at this location'
		}
		if (this.usersToAdd().has(userId)) {
			return 'User is selected for addition'
		}
		return 'User is not selected'
	}
	
}
