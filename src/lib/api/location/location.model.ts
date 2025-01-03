import {BaseModel} from '../base-api/base.model'
import {LocationType} from './location-type.enum'

export interface Location extends BaseModel{
	createdBy?: string;
	createdOn?: string;
	usageCount?: number;
	organizationId?: string;
	locationType?: LocationType;
	name?: string;
	description?: string;
}
