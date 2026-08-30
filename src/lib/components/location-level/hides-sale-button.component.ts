import {Component, inject, OnDestroy, OnInit} from '@angular/core'
import {SaleFormVisibilityContext} from './sales/sale-form-visibility.context'

@Component({
  selector: 'rts-hides-sale-button',
  template: ''
})
export abstract class HidesSaleButtonComponent implements OnInit, OnDestroy {

  private readonly saleFormVisibilityContext = inject(SaleFormVisibilityContext)

  ngOnInit() {
    this.saleFormVisibilityContext.hideSaleButton()
  }

  ngOnDestroy() {
    this.saleFormVisibilityContext.showSaleButton()
  }
}
