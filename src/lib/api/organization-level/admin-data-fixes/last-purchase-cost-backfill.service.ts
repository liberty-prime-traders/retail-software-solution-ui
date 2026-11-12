import {Injectable} from '@angular/core'
import {AdminDataFixRequestService} from './admin-data-fix-request.service'

@Injectable({providedIn: 'root'})
export class LastPurchaseCostBackfillService extends AdminDataFixRequestService {
  protected readonly path = '/secured/admin-data/last-purchase-cost/backfill'
}
