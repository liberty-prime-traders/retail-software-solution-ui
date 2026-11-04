import {Injectable} from '@angular/core'
import {AdminDataFixRequestService} from './admin-data-fix-request.service'

@Injectable({providedIn: 'root'})
export class SaleLineCogsBackfillService extends AdminDataFixRequestService {
  protected readonly path = '/secured/admin-data/sale-line-cogs/backfill'
}
