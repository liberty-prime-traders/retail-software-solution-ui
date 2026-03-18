import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {OrgJurisdictionTaxTypeService} from '../../../api/organization-level/org-jurisdiction-tax-type/org-jurisdiction-tax-type.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {NewFormCancelButtonComponent} from '../../reusable/new-form-cancel-button.component'
import {OrgJurisdictionTaxTypeAddFormComponent} from './org-jurisdiction-tax-type-add-form/org-jurisdiction-tax-type-add-form.component'
import {OrgJurisdictionTaxTypeEditFormComponent} from './org-jurisdiction-tax-type-edit-form/org-jurisdiction-tax-type-edit-form.component'

@Component({
  selector: 'rts-org-jurisdiction-tax-type',
  templateUrl: 'org-jurisdiction-tax-type.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    OrgJurisdictionTaxTypeAddFormComponent,
    OrgJurisdictionTaxTypeEditFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    AutoStretchDirective,
    NewFormCancelButtonComponent
  ]
})
export class OrgJurisdictionTaxTypeComponent extends GridWithAddButtonComponent<OrgJurisdictionTaxTypeService> {
  private readonly orgJurisdictionTaxTypeService = inject(OrgJurisdictionTaxTypeService)
  readonly apiService = this.orgJurisdictionTaxTypeService

  readonly entities = this.orgJurisdictionTaxTypeService.selectAll
}
