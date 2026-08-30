import {CurrencyPipe} from '@angular/common'
import {Component, computed, effect, inject, linkedSignal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Badge} from 'primeng/badge'
import {Button} from 'primeng/button'
import {Chip} from 'primeng/chip'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {ProductWithAvailability} from '../../../../api/location-level/product-lookup/product-with-availability.model'
import {StockTransferPerspective} from '../../../../api/location-level/stock-transfer/stock-transfer-perspective.enum'
import {
  StockTransferLineAddRequest,
  StockTransferLineUpdateRequest
} from '../../../../api/location-level/stock-transfer/stock-transfer-requests.model'
import {StockTransferService} from '../../../../api/location-level/stock-transfer/stock-transfer.service'
import {
  AlternativeUnitsFinderPipe
} from '../../../../api/organization-level/unit-conversion/pipes/alternative-units-finder.pipe'
import {UnitDescriptionPipe} from '../../../../api/organization-level/unit-conversion/pipes/unit-description.pipe'
import {
  UnitConversionGraphService
} from '../../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {
  AvailableProductLookupComponent
} from '../../location-product-lookup/available-product-lookup/available-product-lookup.component'
import {StockTransferFormContext} from '../stock-transfer-form/stock-transfer-form-context'
import {StockTransferLineFormDefinition} from './stock-transfer-line-form.definition'
import {StockTransferLineHasChangedPipe} from './stock-transfer-line-has-changed.pipe'
import StockTransferLineFormModel = StockTransferLineFormDefinition.StockTransferLineFormModel

@Component({
  selector: 'rts-location-stock-transfer-lines',
  templateUrl: 'stock-transfer-lines.component.html',
  imports: [
    TableModule,
    FormsModule,
    Button,
    InputNumber,
    Select,
    CurrencyPipe,
    NullSafePipe,
    AlternativeUnitsFinderPipe,
    UnitDescriptionPipe,
    EmptyRowComponent,
    StockTransferLineHasChangedPipe,
    AvailableProductLookupComponent,
    Badge,
    Chip
  ]
})
export class StockTransferLinesComponent {
  private readonly stockTransferService = inject(StockTransferService)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)
  protected readonly context = inject(StockTransferFormContext)

  readonly StockTransferPerspective = StockTransferPerspective
  readonly isDraft = this.context.isDraft
  readonly perspective = this.context.perspective

  readonly canManageLines = computed(() =>
    this.isDraft() && this.context.perspective() === StockTransferPerspective.OUTGOING
  )

  readonly colspan = computed(() => {
    const fullSpan = this.canManageLines() ? 7 : 6
    return fullSpan - (this.isDraft() ? 3 : 0)
  })

  readonly unitConversionGraphIsLoading = this.unitConversionGraphService.isLoading

  readonly lines = linkedSignal<StockTransferLineFormModel[]>(() =>
    this.unitConversionGraphIsLoading()
      ? []
      : StockTransferLineFormDefinition.mapLines(this.context.transfer()?.dispatch.lines ?? [])
  )

  private readonly syncPendingEditsWithContext = effect(() => {
    const hasPendingEdits = this.lines().some(StockTransferLineFormDefinition.hasChanged)
    this.context.setHasPendingLineEdits(hasPendingEdits)
  })

  readonly trackByLineRef = (_index: number, line: StockTransferLineFormModel) => line.dispatchLineRef

  readonly emptyLinesMessage = computed(() =>
    this.unitConversionGraphIsLoading() ? 'Loading ...' : 'No lines added yet.'
  )

  sendLineRequest(newProduct?: ProductWithAvailability) {
    const orderRef = this.context.orderRef()
    if (!orderRef) return
    this.stockTransferService.applyLineChanges(
      orderRef,
      {
        additions: this.getLinesToAdd(newProduct),
        updates: this.getLinesToUpdate()
      },
      {onSuccess: (response) => this.context.viewTransfer(response)}
    )
  }

  private getLinesToAdd(newProduct?: ProductWithAvailability): StockTransferLineAddRequest[] {
    if (!newProduct) return []
    return [{locationProductId: newProduct.id, quantityDispatched: 1}]
  }

  private getLinesToUpdate(): StockTransferLineUpdateRequest[] {
    return this.lines()
      .filter(StockTransferLineFormDefinition.hasChanged)
      .map(StockTransferLineFormDefinition.toUpdateRequest)
  }

  updateQuantity(line: StockTransferLineFormModel, quantity: number) {
    this.patchLine(line.dispatchLineRef, {quantity})
  }

  updateUnitId(line: StockTransferLineFormModel, unitId: string) {
    this.patchLine(line.dispatchLineRef, {unitId})
  }

  private patchLine(dispatchLineRef: string, changes: Partial<StockTransferLineFormModel>) {
    this.lines.update(lines =>
      lines.map(line => line.dispatchLineRef === dispatchLineRef ? {...line, ...changes} : line)
    )
  }

  removeLine(line: StockTransferLineFormModel) {
    const orderRef = this.context.orderRef()
    if (orderRef) {
      this.stockTransferService.removeLine(
        orderRef,
        line.dispatchLineRef,
        {onSuccess: (response) => this.context.viewTransfer(response)}
      )
    }
  }

  confirmLine(line: StockTransferLineFormModel) {
    const orderRef = this.context.orderRef()
    if (orderRef) {
      this.stockTransferService.confirmLine(
        orderRef,
        line.dispatchLineRef,
        {onSuccess: (response) => this.context.viewTransfer(response)}
      )
    }
  }

  undoLineConfirmation(line: StockTransferLineFormModel) {
    const orderRef = this.context.orderRef()
    if (orderRef) {
      this.stockTransferService.undoLineConfirmation(
        orderRef,
        line.dispatchLineRef,
        {onSuccess: (response) => this.context.viewTransfer(response)}
      )
    }
  }

}
