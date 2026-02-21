import {Pipe, PipeTransform} from '@angular/core'
import {JoinRequestStatus} from '../../api/util/join-request/join-request-status.enum'
import {RtsSeverity} from '../types/severity'

@Pipe({name: 'joinRequestStatusSeverity'})
export class JoinRequestStatusSeverityPipe implements PipeTransform {
  transform(status?: JoinRequestStatus): RtsSeverity {
    switch (status) {
    case JoinRequestStatus.PENDING:
      return RtsSeverity.WARN
    case JoinRequestStatus.APPROVED:
      return RtsSeverity.SUCCESS
    case JoinRequestStatus.DENIED:
      return RtsSeverity.DANGER
    default:
      return RtsSeverity.INFO
    }
  }
}
