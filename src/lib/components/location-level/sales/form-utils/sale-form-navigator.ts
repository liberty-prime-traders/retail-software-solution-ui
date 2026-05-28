import {inject, Injectable, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {SaleSummaryService} from '../../../../api/location-level/sale-summary/sale-summary.service'
import {
  UnsavedCartsSummaryService
} from '../../../../api/location-level/unsaved-carts-summary/unsaved-carts-summary.service'
import {defaultSaleSession} from '../../../../api/location-level/sale_session/sale-session-default.value'
import {SaleSession} from '../../../../api/location-level/sale_session/sale-session.model'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {SaleFormVisibilityContext} from '../sale-form-visibility.context'
import {SaleFormContext} from './sale-form-context'
import {SaleFormMode} from './sale-form-mode.enum'

@Injectable({providedIn: 'root'})
export class SaleFormNavigator {

  private readonly formContext = inject(SaleFormContext)
  private readonly visibility = inject(SaleFormVisibilityContext)
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly unsavedCartsSummaryService = inject(UnsavedCartsSummaryService)
  private readonly saleSummaryService = inject(SaleSummaryService)

  private readonly _mode = signal<SaleFormMode>(SaleFormMode.FORM)
  private readonly _formOpenedFromPicker = signal(false)

  readonly mode = this._mode.asReadonly()

  openForNewSale() {
    this._formOpenedFromPicker.set(false)
    this.visibility.showForm()
    this.unsavedCartsSummaryService.getMySessions({
      onSuccess: () => {
        if (this.unsavedCartsSummaryService.selectCount() > 0) {
          this._mode.set(SaleFormMode.PICKER)
        } else {
          this.formContext.loadSession(defaultSaleSession())
          this._mode.set(SaleFormMode.FORM)
        }
      }
    })
  }

  openForEditSale(saleId: EntityId) {
    this.saleSessionService.startNewSession({saleId}, {
      onSuccess: (session) => {
        this._formOpenedFromPicker.set(false)
        this.enterFormWithSession(session)
      }
    })
  }

  resumeOpenSession(sessionId: string) {
    this.saleSessionService.acquireSession(sessionId, {
      onSuccess: (session) => {
        this._formOpenedFromPicker.set(true)
        this.enterFormWithSession(session)
      }
    })
  }

  proceedToNewSession() {
    this.formContext.loadSession(defaultSaleSession())
    this._formOpenedFromPicker.set(true)
    this._mode.set(SaleFormMode.FORM)
  }

  backFromForm() {
    if (this._formOpenedFromPicker() && this.unsavedCartsSummaryService.selectCount() > 0) {
      this.unsavedCartsSummaryService.refetch()
      this._mode.set(SaleFormMode.PICKER)
    } else {
      this.closeForm()
    }
  }

  discardSession(sessionId: string) {
    this.unsavedCartsSummaryService.abandonSession(sessionId)
  }

  closeForm() {
    this.visibility.hideForm()
    this.saleSummaryService.refetch()
  }

  private enterFormWithSession(session: SaleSession) {
    this.formContext.loadSession(session)
    this._mode.set(SaleFormMode.FORM)
    this.visibility.showForm()
  }
}
