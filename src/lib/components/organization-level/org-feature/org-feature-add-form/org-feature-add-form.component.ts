import {Component, computed, inject, model, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {MultiSelect} from 'primeng/multiselect'
import {OrganizationFeature} from '../../../../api/organization-level/org-feature/org-feature.model'
import {OrgFeatureService} from '../../../../api/organization-level/org-feature/org-feature.service'
import {Feature} from '../../../../api/platform-level/platform-feature/feature.enum'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'

@Component({
  selector: 'rts-org-feature-add-form',
  templateUrl: 'org-feature-add-form.component.html',
  imports: [
    Button,
    MultiSelect,
    FormsModule,
    LoadingContainerComponent,
    PrettifyEnumPipe
  ]
})
export class OrgFeatureAddFormComponent implements OnInit {

  private readonly orgFeatureService = inject(OrgFeatureService)

  readonly allSaved = output<void>()

  readonly processingStatus = this.orgFeatureService.selectProcessingStatus
  readonly failureMessages = this.orgFeatureService.selectFailureMessages
  readonly loading = this.orgFeatureService.selectLoading
  readonly activationFailureMessages = this.orgFeatureService.activationFailureMessages
  readonly selectedFeatures = model<Feature[]>([])
  readonly featuresToActivate = signal<Feature[]>([])

  readonly availableFeatures = computed(() => {
    const existingFeatures = new Set(this.orgFeatureService.selectAll().map((f: OrganizationFeature) => f.feature))
    const stagedFeatures = new Set(this.featuresToActivate())
    return Object.values(Feature)
      .filter(f => !existingFeatures.has(f) && !stagedFeatures.has(f))
      .map(f => ({label: PrettifyEnumPipe.prototype.transform(f), value: f}))
  })

  ngOnInit() {
    this.orgFeatureService.resetProcessingStatus()
  }

  confirmSelection() {
    this.featuresToActivate.update(current => [...current, ...this.selectedFeatures()])
    this.selectedFeatures.set([])
  }

  removeFeature(feature: Feature) {
    this.featuresToActivate.update(current => current.filter(f => f !== feature))
  }

  activate() {
    this.orgFeatureService.activate(this.featuresToActivate(), {
      onSuccess: () => this.allSaved.emit()
    })
  }
}
