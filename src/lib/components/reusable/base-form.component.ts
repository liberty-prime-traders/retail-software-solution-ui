import {Component, computed, OnInit} from '@angular/core'
import {BaseService} from '../../api/util/base-api/base.service'

@Component({template: ''})
export abstract class BaseFormComponent<SERVICE extends BaseService<any, any>> implements OnInit {

  protected abstract readonly apiService: SERVICE

  protected readonly processingStatus = computed(() => this.apiService.selectProcessingStatus())
  protected readonly failureMessages = computed(() => this.apiService.selectFailureMessages())

  ngOnInit() {
    this.apiService.resetProcessingStatus()
  }
}
