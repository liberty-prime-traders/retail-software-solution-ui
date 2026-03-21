import {NgClass} from '@angular/common'
import {Component, input} from '@angular/core'
import {ProgressSpinner} from 'primeng/progressspinner'

@Component({
  selector: 'rts-loading-container',
  styleUrl: 'loading-container.component.scss',
  template: `
    <div class="loading-wrapper" [ngClass]="{'loading': loading()}">
      <ng-content/>

      @if (loading()) {
        <div class="flex flex-column gap-1 absolute left-50 top-50">
          <p-progress-spinner/>
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
  readonly loading = input(false)
  readonly loadingText = input('Loading')
}
