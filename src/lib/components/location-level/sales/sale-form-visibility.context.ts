import {Injectable, signal} from '@angular/core'

@Injectable({providedIn: 'root'})
export class SaleFormVisibilityContext {

  private readonly _formIsVisible = signal(false)
  private readonly _newSaleButtonIsVisible = signal(true)

  readonly formIsVisible = this._formIsVisible.asReadonly()
  readonly newSaleButtonIsVisible = this._newSaleButtonIsVisible.asReadonly()

  showForm() {
    this._formIsVisible.set(true)
  }

  hideForm() {
    this._formIsVisible.set(false)
  }

  showSaleButton() {
    this._newSaleButtonIsVisible.set(true)
  }

  hideSaleButton() {
    this._newSaleButtonIsVisible.set(false)
  }

}
