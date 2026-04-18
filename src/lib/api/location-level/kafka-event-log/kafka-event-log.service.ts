import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {KafkaEventLog} from './kafka-event-log.model'
import {KafkaEventLogStore} from './kafka-event-log.store'

@Injectable({providedIn: 'root'})
export class KafkaEventLogService extends MultimapBaseService<KafkaEventLog> {

  protected override keyPath: keyof KafkaEventLog = 'sourceDocumentId'

  constructor(protected override readonly store: KafkaEventLogStore) {
    super(store)
  }

  retry(logId: EntityId, callbacks?: ApiCallbacks<KafkaEventLog>): void {
    this.patchApiRequestConfig({urlSuffix: 'retry'})
    this.post({}, callbacks, logId)
  }
}
