import {AfterViewInit, Component} from '@angular/core'
import {AutoResizeConfig} from '../welcome/auto-resize-config'

@Component({selector: 'lbu-auto-stretch', template: ''})
export abstract class AutoStretchComponent implements AfterViewInit {
  ngAfterViewInit() {
    AutoResizeConfig.stretchAllElements()
  }
}
