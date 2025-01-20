import {Severity} from '../../../../../utils/types/severity'
import {UserLocationAssignmentAction} from './user-location-assignment-action.enum'

export interface UserLocationAssignmentContext {
	action: UserLocationAssignmentAction,
	comment: string,
	icon: string,
	severity: Severity
}
