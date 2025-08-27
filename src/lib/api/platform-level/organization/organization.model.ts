import {BaseModel} from '../../util/base-api/base.model'

export interface Organization extends BaseModel{
	createdBy?: string
	createdOn?: number
	usageCount?: number
	name?: string
	description?: string
	subdomain?: string
}
