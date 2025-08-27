import {BaseModel} from '../../util/base-api/base.model'
import {SchemaLevel} from './schema-level.enum'

export interface TableRegistry extends BaseModel {
  tableName?: string
  defaultPrefix?: string
  minimumVersion?: string
  minimumVersionId?: string
  schemaLevel?: SchemaLevel
  displayName?: string
  description?: string
  userFacing?: boolean
  createdBy?: string
  nextNumber?: number
}
