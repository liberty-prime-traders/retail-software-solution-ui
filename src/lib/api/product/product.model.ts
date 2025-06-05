import {BaseModel} from '../base-api/base.model'

export interface Product extends BaseModel{
  createdBy?: string;
  createdOn?: string;
  usageCount?: number;
  productName?: string;
  description?: string;
  categoryName?: string;
}
