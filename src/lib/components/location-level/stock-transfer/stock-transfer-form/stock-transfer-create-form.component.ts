import {Component, computed, inject, OnInit, output, signal} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {Button} from 'primeng/button'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {StockTransferCreateDto} from '../../../../api/location-level/stock-transfer/stock-transfer-create.dto'
import {StockTransferResponse} from '../../../../api/location-level/stock-transfer/stock-transfer-response.model'
import {StockTransferService} from '../../../../api/location-level/stock-transfer/stock-transfer.service'
import {LocationService} from '../../../../api/organization-level/location/location.service'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {StockTransferCreateFormDefinition} from './stock-transfer-create-form.definition'

@Component({
  selector: 'rts-location-stock-transfer-create-form',
  templateUrl: 'stock-transfer-create-form.component.html',
  imports: [
    FormField,
    FormFieldComponent,
    Select,
    InputText,
    Button,
    ErrorSummaryComponent,
    LoadingContainerComponent
  ]
})
export class StockTransferCreateFormComponent implements OnInit {
  private readonly locationService = inject(LocationService)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly stockTransferService = inject(StockTransferService)

  readonly transferCreated = output<StockTransferResponse>()

  readonly locations = computed(() =>
    this.locationService.selectAll().filter(
      location => location.id !== this.sessionContextService.selectedLocation()?.id
    )
  )

  readonly loading = this.stockTransferService.selectLoading
  readonly failureMessages = this.stockTransferService.selectFailureMessages
  readonly fieldMap = StockTransferCreateFormDefinition.fieldMap

  private readonly stockTransferCreateFormValue =
    signal(StockTransferCreateFormDefinition.defaultStockTransferCreateFormModel)

  readonly stockTransferCreateForm =
    form(this.stockTransferCreateFormValue, StockTransferCreateFormDefinition.stockTransferCreateFormSchema)

  ngOnInit() {
    this.locationService.fetch()
  }

  createTransfer() {
    const body: StockTransferCreateDto = this.stockTransferCreateFormValue()
    this.stockTransferService.createTransfer(body, {onSuccess: (response) => this.transferCreated.emit(response)})
  }
}
