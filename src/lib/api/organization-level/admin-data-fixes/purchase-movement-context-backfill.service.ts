import {Injectable} from '@angular/core'
import {AdminDataFixRequestService} from './admin-data-fix-request.service'

@Injectable({providedIn: 'root'})
export class PurchaseMovementContextBackfillService extends AdminDataFixRequestService {
  protected readonly path = '/secured/admin-data/purchase-movement-context/backfill'
}
