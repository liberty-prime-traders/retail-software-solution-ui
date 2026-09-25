import {HttpErrorResponse} from '@angular/common/http'
import {computed, inject, Injectable, signal} from '@angular/core'
import {MessageService} from 'primeng/api'
import {LocationProductPaginatedSearchService} from '../../../../api/location-level/location-product/location-product-paginated-search.service'
import {LocationProduct} from '../../../../api/location-level/location-product/location-product.model'
import {OpeningStockLine} from '../../../../api/location-level/opening-stock/opening-stock.model'
import {OpeningStockService} from '../../../../api/location-level/opening-stock/opening-stock.service'
import {parseError} from '../../../../utils/errors'
import {LocationProductFilterService} from '../location-product-filter.service'
import {OpeningStockDraftLine} from './opening-stock-draft-line.model'

@Injectable({providedIn: 'root'})
export class OpeningStockDeclarationService {
  private readonly openingStockService = inject(OpeningStockService)
  private readonly locationProductSearchService = inject(LocationProductPaginatedSearchService)
  private readonly locationProductFilterService = inject(LocationProductFilterService)

  private readonly drafts = signal(new Map<string, OpeningStockDraftLine>())
  private readonly declaredQuantities = signal(new Map<string, number>())
  readonly saving = this.openingStockService.selectLoading

  readonly canDeclare = computed(() =>
    Array.from(this.drafts().values()).some(draft => draft.quantity > 0 && draft.unitCost > 0)
  )

  isDeclared(product: LocationProduct): boolean {
    return this.declaredQuantities().has(product.id as string)
  }

  declaredQuantityFor(product: LocationProduct): number | undefined {
    return this.declaredQuantities().get(product.id as string)
  }

  draftFor(product: LocationProduct): OpeningStockDraftLine {
    return this.drafts().get(product.id as string) ?? {quantity: 0, unitId: product.baseUnitId, unitCost: 0}
  }

  updateDraft(product: LocationProduct, changes: Partial<OpeningStockDraftLine>) {
    this.drafts.update(drafts => {
      const next = new Map(drafts)
      next.set(product.id as string, {...this.draftFor(product), ...changes})
      return next
    })
  }

  declareAll(messageService: MessageService) {
    const lines: Partial<OpeningStockLine>[] = Array.from(this.drafts().entries())
      .filter(([, draft]) => draft.quantity > 0 && draft.unitCost > 0)
      .map(([locationProductId, draft]) => ({
        locationProductId, quantity: draft.quantity, unitId: draft.unitId, unitCost: draft.unitCost
      }))

    if (lines.length === 0) return

    this.openingStockService.declareInitialStock(lines, {
      onSuccess: (result) => this.onDeclared(Array.isArray(result) ? result : [result], messageService),
      onFail: (error) => this.onDeclareFailed(error, messageService)
    })
  }

  private onDeclared(declaredLines: OpeningStockLine[], messageService: MessageService) {
    const currentProducts = this.locationProductSearchService.selectAll()
    const updatedProducts: LocationProduct[] = declaredLines.flatMap(line => {
      const existing = currentProducts.find(product => product.id === line.locationProductId)
      return existing ? [{...existing, openingStockQuantity: line.quantity}] : []
    })

    this.locationProductSearchService.pushToPaginatedEntities(updatedProducts)

    if (this.locationProductSearchService.requireClientSideFilter()) {
      this.locationProductFilterService.reloadClientSideFilteredEntities()
    }

    this.drafts.update(drafts => {
      const next = new Map(drafts)
      declaredLines.forEach(line => next.delete(line.locationProductId as string))
      return next
    })

    this.declaredQuantities.update(quantities => {
      const next = new Map(quantities)
      declaredLines.forEach(line => next.set(line.locationProductId as string, line.quantity))
      return next
    })

    messageService.add({
      severity: 'success',
      summary: 'Opening stock declared successfully',
      detail: 'It may take a few minutes for remaining stock to be updated in the system.'
    })
  }

  private onDeclareFailed(error: HttpErrorResponse, messageService: MessageService) {
    const otherErrors = error.error.body ?? ['Please try again later.']
    messageService.add({
      severity: 'error',
      summary: parseError(error)[0] || 'Failed to declare opening stock',
      detail: otherErrors.join(', ')
    })
  }
}
