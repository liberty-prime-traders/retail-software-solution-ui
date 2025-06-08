import {BaseModel} from '../base-api/base.model'

export interface ExpirableAssignment extends BaseModel {
	startOn?: number
	endOn?: number
	name?: string
}
