import {Pipe, PipeTransform} from '@angular/core'
import {JoinRequestStatus} from '../../api/util/join-request/join-request-status.enum'
import {ActivityStatus} from '../types/activity-status.enum'

@Pipe({name: 'activityStatusSeverity'})
export class ActivityStatusSeverityPipe implements PipeTransform {
  transform(status?: ActivityStatus) {
    switch (status) {
    case JoinRequestStatus.PENDING:
      return 'warn'
    case JoinRequestStatus.APPROVED:
      return 'success'
    case JoinRequestStatus.DENIED:
      return 'danger'
    default:
      return 'info'
    }
  }
}
