import {CurrencyPipe} from '@angular/common'
import {Component, inject, input} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {Badge} from 'primeng/badge'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Divider} from 'primeng/divider'
import {IftaLabel} from 'primeng/iftalabel'
import {InputGroup} from 'primeng/inputgroup'
import {InputGroupAddon} from 'primeng/inputgroupaddon'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {Tooltip} from 'primeng/tooltip'
import {SaleLine} from '../../../../../api/location-level/sale_session/sale-session.model'
import {SaleSessionService} from '../../../../../api/location-level/sale_session/sale-session.service'
import {
  AlternativeUnitsFinderPipe
} from '../../../../../api/organization-level/unit-conversion/pipes/alternative-units-finder.pipe'
import {
  ConversionContextPipe,
  UnitConversionDescriptorPipe,
  UnitConvertPipe,
  UnitCurrencyPipe,
  UnitLabelPipe
} from '../../../../../api/organization-level/unit-conversion/pipes/unit-convert.pipe'
import {
  UnitCodePipe,
  UnitDescriptionPipe
} from '../../../../../api/organization-level/unit-conversion/pipes/unit-description.pipe'
import {SaleFormContext} from '../../form-utils/sale-form-context'
import {SaleLineFormDefinition} from '../../form-utils/sale-line-form.definition'
import {SaleLineHasChangedPipe} from '../sale-line-has-changed.pipe'

@Component({
  selector: 'rts-editable-sale-lines',
  imports: [
    AlternativeUnitsFinderPipe,
    Badge,
    Button,
    Card,
    ConversionContextPipe,
    CurrencyPipe,
    Divider,
    IftaLabel,
    InputGroup,
    InputGroupAddon,
    InputNumber,
    SaleLineHasChangedPipe,
    Select,
    Tooltip,
    UnitCodePipe,
    UnitConversionDescriptorPipe,
    UnitConvertPipe,
    UnitCurrencyPipe,
    UnitDescriptionPipe,
    UnitLabelPipe,
    FormField
  ],
  templateUrl: 'editable-sale-lines.component.html'
})
export class EditableSaleLinesComponent {
  private readonly context = inject(SaleFormContext)
  private readonly saleSessionService = inject(SaleSessionService)

  readonly saleLinesFieldTree = this.context.saleForm.saleLines

  readonly saleLines = input.required<SaleLineFormDefinition.SaleLineFormModel[]>()

  removeSaleLine(line: SaleLine) {
    this.saleSessionService.removeSaleLine(
      line.identity,
      {onSuccess: this.context.loadSession}
    )
  }

  sendLineRequest() {
    this.context.sendLineRequest()
  }
}
