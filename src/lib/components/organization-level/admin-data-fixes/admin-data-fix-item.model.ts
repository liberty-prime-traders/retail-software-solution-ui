import {Signal} from '@angular/core'
import {AdminDataFixRequestService} from '../../../api/organization-level/admin-data-fixes/admin-data-fix-request.service'

export enum AdminDataFix {
  SEED_DEFAULTS = 'SEED_DEFAULTS',
  SALE_LINE_COGS_BACKFILL = 'SALE_LINE_COGS_BACKFILL'
}

export interface AdminDataFixItem {
  fix: AdminDataFix
  title: string
  description: string
  buttonLabel: string
  successDetail: string
  requestService: AdminDataFixRequestService
  isLoading: Signal<boolean>
}
