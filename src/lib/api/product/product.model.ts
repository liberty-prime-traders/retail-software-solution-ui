import {BaseModel} from '../base-api/base.model'
import {EntityId} from '@ngrx/signals/entities'

export interface Product extends BaseModel{
  createdBy?: string;
  createdOn?: number;
  usageCount?: number;
  productName?: string;
  description?: string;
  categoryName?: string;
  categoryId?: EntityId;
}
