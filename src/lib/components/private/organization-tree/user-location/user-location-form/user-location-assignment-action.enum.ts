import {Severity} from '../../../../../utils/types/severity'

export enum UserLocationAssignmentAction {
	ADD = "ADD",
	REMOVE = "REMOVE"
}

export const getIcon = (action: UserLocationAssignmentAction): string =>
	action === UserLocationAssignmentAction.ADD ? 'pi pi-plus' : 'pi pi-minus'

export const getSeverity = (action: UserLocationAssignmentAction): Severity =>
	action === UserLocationAssignmentAction.ADD ? 'info' : 'secondary'
