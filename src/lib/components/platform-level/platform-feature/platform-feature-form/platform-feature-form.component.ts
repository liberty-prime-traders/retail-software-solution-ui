import {Component, inject, Input, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {Textarea} from 'primeng/textarea'
import {PlatformFeature} from '../../../../api/platform-level/platform-feature/platform-feature.model'
import {PlatformFeatureService} from '../../../../api/platform-level/platform-feature/platform-feature.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {PlatformFeatureFormDefinition} from './platform-feature-form.definition'

@Component({
  selector: 'rts-platform-feature-form',
  templateUrl: 'platform-feature-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField
  ]
})
export class PlatformFeatureFormComponent extends BaseFormComponent<PlatformFeatureService> {

  private readonly platformFeatureService = inject(PlatformFeatureService)
  protected override readonly apiService = this.platformFeatureService

  @Input()
  set platformFeature(platformFeature: PlatformFeature | null) {
    if (platformFeature) {
      this.originalPlatformFeature.set(platformFeature)
      this.platformFeatureFormValue.set(PlatformFeatureFormDefinition.convertToFormModel(platformFeature))
    }
  }

  readonly originalPlatformFeature = signal<PlatformFeature | undefined>(undefined)

  readonly platformFeatureFormValue = signal<PlatformFeatureFormDefinition.PlatformFeatureFormModel>(
    PlatformFeatureFormDefinition.defaultPlatformFeatureFormModel
  )

  readonly platformFeatureForm = form(this.platformFeatureFormValue, PlatformFeatureFormDefinition.platformFeatureFormSchema)
  readonly platformFeatureFormFields = PlatformFeatureFormDefinition.fieldMap

  resetForm() {
    this.platformFeatureForm().reset(PlatformFeatureFormDefinition.convertToFormModel(this.originalPlatformFeature()))
  }

  savePlatformFeature() {
    const updated: Partial<PlatformFeature> = PlatformFeatureFormDefinition.convertToBackendModel(this.platformFeatureFormValue())
    this.platformFeatureService.put(updated)
  }
}
