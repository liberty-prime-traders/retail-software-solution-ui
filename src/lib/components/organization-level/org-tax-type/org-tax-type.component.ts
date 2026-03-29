import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {OrgTaxTypeService} from '../../../api/organization-level/org-tax-type/org-tax-type.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {NewFormCancelButtonComponent} from '../../reusable/new-form-cancel-button.component'
import {OrgTaxTypeAddFormComponent} from './org-tax-type-add-form/org-tax-type-add-form.component'
import {OrgTaxTypeEditFormComponent} from './org-tax-type-edit-form/org-tax-type-edit-form.component'

@Component({
  selector: 'rts-org-tax-type',
  templateUrl: 'org-tax-type.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    OrgTaxTypeAddFormComponent,
    OrgTaxTypeEditFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    AutoStretchDirective,
    NewFormCancelButtonComponent,
    PrettifyEnumPipe
  ]
})
export class OrgTaxTypeComponent extends GridWithAddButtonComponent<OrgTaxTypeService> {
  private readonly orgJurisdictionTaxTypeService = inject(OrgTaxTypeService)
  readonly apiService = this.orgJurisdictionTaxTypeService

  readonly entities = this.orgJurisdictionTaxTypeService.selectAll
}
