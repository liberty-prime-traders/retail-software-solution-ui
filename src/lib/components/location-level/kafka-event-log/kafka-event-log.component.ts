import {DatePipe} from '@angular/common'
import {Component, effect, inject, input, OnDestroy, signal, untracked} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {EventProcessingLogStatus} from '../../../api/location-level/kafka-event-log/kafka-event-log.model'
import {KafkaEventLogService} from '../../../api/location-level/kafka-event-log/kafka-event-log.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-kafka-event-log',
  templateUrl: 'kafka-event-log.component.html',
  imports: [
    TableModule,
    Button,
    DatePipe,
    NullSafePipe,
    EmptyRowComponent,
    PrettifyEnumPipe
  ]
})
export class KafkaEventLogComponent implements OnDestroy {
  readonly sourceDocumentId = input.required<EntityId>()

  private readonly kafkaEventLogService = inject(KafkaEventLogService)
  private readonly messageService = inject(MessageService)

  private pollingInterval = signal<ReturnType<typeof setInterval> | undefined>(undefined)
  readonly loading = this.kafkaEventLogService.selectLoading
  readonly kafkaLogs = this.kafkaEventLogService.selectForGroup(this.sourceDocumentId)

  private readonly discontinuePolling = effect(() => {
    const hasRetrying = this.kafkaLogs().some(l => l.status === EventProcessingLogStatus.RETRYING)
    untracked(() => {
      if (hasRetrying) {
        this.startPolling()
      } else {
        this.clearPolling()
      }
    })

  })

  private readonly refetchOnSourceDocumentChange = effect(() => {
    this.sourceDocumentId()
    untracked(() => this.kafkaEventLogService.refetch(this.sourceDocumentId()))
  })

  ngOnDestroy() {
    this.clearPolling()
  }

  refreshAll() {
    this.kafkaEventLogService.forceRefetch(this.sourceDocumentId())
  }

  retry(logId: EntityId) {
    this.kafkaEventLogService.retry(logId, {
      onSuccess: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Retry Submitted',
          detail: 'Retry has been sent. Please wait for it to complete.'
        })
        this.startPolling()
      },
      onFail: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Retry Failed',
          detail: 'Failed to submit retry. Please try again.'
        })
      }
    })
  }

  private startPolling() {
    this.clearPolling()
    this.pollingInterval.set(setInterval(() => {this.refreshAll()}, 5000))
  }

  private clearPolling() {
    if (this.pollingInterval()) {
      clearInterval(this.pollingInterval())
      this.pollingInterval.set(undefined)
    }
  }
}
