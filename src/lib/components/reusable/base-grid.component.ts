import {Component, computed, OnInit} from '@angular/core'
import {BaseService} from '../../api/util/base-api/base.service'

@Component({template: ''})
export abstract class BaseGridComponent<SERVICE extends BaseService<any, any>> implements OnInit {
  protected abstract readonly apiService: SERVICE
  readonly loading = computed(() => this.apiService.selectLoading())

  ngOnInit() {
    this.apiService.fetch()
  }
}
