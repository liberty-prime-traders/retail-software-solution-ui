import {Pipe, PipeTransform} from '@angular/core'
import {JoinRequestStatus} from '../../api/join-request/join-request-status.enum'

@Pipe({name: 'joinRequestStatusSeverity'})
export class JoinRequestStatusSeverityPipe implements PipeTransform {
  transform(status?: JoinRequestStatus) {
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
