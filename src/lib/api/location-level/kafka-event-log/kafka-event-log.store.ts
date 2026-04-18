import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {KafkaEventLog} from './kafka-event-log.model'

@Injectable({providedIn: 'root'})
export class KafkaEventLogStore extends createBaseStore<KafkaEventLog>() implements BaseStore<KafkaEventLog> {
  readonly basePath = 'kafka-event-log'
}
