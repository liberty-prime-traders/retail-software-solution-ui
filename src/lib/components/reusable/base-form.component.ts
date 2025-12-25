import {Component, OnInit} from '@angular/core'
import {BaseService} from '../../api/util/base-api/base.service'

@Component({template: ''})
export abstract class BaseFormComponent<SERVICE extends BaseService<any, any>> implements OnInit {
  protected abstract readonly apiService: SERVICE

  ngOnInit() {
    this.apiService.resetProcessingStatus()
  }
}
