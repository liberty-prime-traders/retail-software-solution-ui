import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../base-api/base.model'
import {LocationType} from './location-type.enum'

export interface Location extends BaseModel{
	createdBy?: string;
	createdOn?: string;
	usageCount?: number;
	organizationId?: EntityId;
	locationType?: LocationType;
	name?: string;
	description?: string;
}
