import {BaseModel} from '../base-api/base.model'

export interface DbVersion extends BaseModel {
  versionNumber?: string;
  sequenceNumber?: number;
  prevVersionId?: string;
  activatedOn?: string;
  createdOn?: string;
  createdBy?: string;
}
