import {JsonObject} from '@angular-devkit/core/src/json/utils'

export interface UnitValueBulkUploadDto extends JsonObject {
  name: string
  code: string
  baseUnitCode: string
  conversionFactor: number
}

export interface UnitGroupBulkUploadDto extends JsonObject {
  name: string
  unitValues: UnitValueBulkUploadDto[]
}

export interface UnitGroupBulkUploadRequest extends JsonObject{
  unitGroups: UnitGroupBulkUploadDto[]
}
