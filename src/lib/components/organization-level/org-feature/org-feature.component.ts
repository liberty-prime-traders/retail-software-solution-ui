import {DatePipe} from '@angular/common'
import {Component, computed, effect, inject, model} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {OrganizationFeatureStatus} from '../../../api/organization-level/org-feature/org-feature-status.enum'
import {OrganizationFeature} from '../../../api/organization-level/org-feature/org-feature.model'
import {OrgFeatureService} from '../../../api/organization-level/org-feature/org-feature.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {NewFormCancelButtonComponent} from '../../reusable/new-form-cancel-button.component'
import {OrgFeatureAddFormComponent} from './org-feature-add-form/org-feature-add-form.component'

@Component({
  selector: 'rts-org-feature',
  templateUrl: 'org-feature.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    PrettifyEnumPipe,
    Button,
    OrgFeatureAddFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    AutoStretchDirective,
    NewFormCancelButtonComponent,
    DatePipe
  ]
})
export class OrgFeatureComponent extends GridWithAddButtonComponent<OrgFeatureService> {
  private readonly messageService = inject(MessageService)
  private readonly orgFeatureService = inject(OrgFeatureService)
  readonly apiService = this.orgFeatureService

  readonly entities = this.orgFeatureService.selectAll
  readonly selectedFeatures = model<OrganizationFeature[]>([])
  readonly processingStatus = this.orgFeatureService.selectProcessingStatus
  readonly failureMessages = this.orgFeatureService.selectFailureMessages

  readonly allSelectedAreActive = computed(() =>
    this.selectedFeatures().length > 0 &&
    this.selectedFeatures().every(f => f.status === OrganizationFeatureStatus.ACTIVE)
  )

  readonly allSelectedAreInactive = computed(() =>
    this.selectedFeatures().length > 0 &&
    this.selectedFeatures().every(f => f.status === OrganizationFeatureStatus.INACTIVE)
  )

  constructor() {
    super()
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS) {
        this.selectedFeatures.set([])
      }
    })
  }

  activate() {
    this.orgFeatureService.activate(
      this.selectedFeatures().map(f => f.feature),
      {
        onFail: () => {
          const failureReasons = this.orgFeatureService.activationFailureMessages()
          this.messageService.addAll(
            failureReasons.map(msg =>
              ({severity: 'error', summary: 'Activation Failed', detail: msg})
            )
          )
        }
      }
    )
  }

  deactivate() {
    this.orgFeatureService.deactivate(this.selectedFeatures().map(f => f.feature))
  }
}
