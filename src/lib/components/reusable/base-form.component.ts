import {Component, computed, effect, OnInit, output, signal} from '@angular/core'
import {BaseService} from '../../api/util/base-api/base.service'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'

@Component({template: ''})
export abstract class BaseFormComponent<SERVICE extends BaseService<any, any>> implements OnInit {

  readonly successfulSave = output<boolean>()

  protected abstract readonly apiService: SERVICE

  protected readonly savedAtLeastOnce = signal(false)
  protected readonly processingStatus = computed(() => this.apiService.selectProcessingStatus())
  protected readonly failureMessages = computed(() => this.apiService.selectFailureMessages())


  constructor() {
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS && this.savedAtLeastOnce()) {
        this.successfulSave.emit(true)
      }
    })
  }

  ngOnInit() {
    this.apiService.resetProcessingStatus()
  }
}
