import {NgClass} from '@angular/common'
import {Component, input} from '@angular/core'
import {ProgressSpinner} from 'primeng/progressspinner'
import {RtsConstants} from '../../../utils/constants'

@Component({
  selector: 'rts-loading-container',
  styleUrl: 'loading-container.component.scss',
  host: {
    '[style.--rts-loading-backdrop-z-index]': 'ZIndexes.LOADING_BACKDROP',
    '[style.--rts-loading-overlay-z-index]': 'ZIndexes.LOADING_OVERLAY'
  },
  template: `
    <div class="loading-wrapper" [ngClass]="{'loading': loading()}">
      <ng-content/>

      @if (loading()) {
        <div class="loading-overlay">
          <p-progress-spinner class="loading-spinner"/>
          <span class="text-center">{{ loadingText() }}</span>
        </div>
      }
    </div>
  `,
  imports: [
    ProgressSpinner,
    NgClass
  ]
})
export class LoadingContainerComponent {
  readonly ZIndexes = RtsConstants.ZIndexes
  readonly loading = input(false)
  readonly loadingText = input('Loading')
}
