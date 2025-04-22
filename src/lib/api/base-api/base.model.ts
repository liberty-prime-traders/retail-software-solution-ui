import {EntityId, EntityState} from '@ngrx/signals/entities'

export interface BaseModel extends EntityState<BaseModel>{
  [key: string]: any
  id: EntityId
}
