import {JsonObject} from '@angular-devkit/core/src/json/utils'

export interface ContactBulkUploadDto extends JsonObject {
  contactTypes: string
  firstName: string | null
  lastName: string | null
  companyName: string | null
  email: string | null
  phone: string | null
  address: string | null
  creditLimit: number | null
  notes: string | null
}
