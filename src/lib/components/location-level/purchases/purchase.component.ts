import {Component, inject, OnInit} from '@angular/core'
import {Button} from 'primeng/button'
import {PurchaseService} from '../../../api/location-level/purchase/purchase.service'
import {PurchaseFormContext} from './purchase-form/form-utils/purchase-form-context'
import {PurchaseFormComponent} from './purchase-form/purchase-form.component'
import {PurchaseGridComponent} from './purchase-grid/purchase-grid.component'

@Component({
  selector: 'rts-purchases',
  templateUrl: 'purchase.component.html',
  providers: [PurchaseFormContext],
  imports: [
    Button,
    PurchaseGridComponent,
    PurchaseFormComponent
  ]
})
export class PurchaseComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService)
  private readonly context = inject(PurchaseFormContext)
  readonly formIsVisible = this.context.formIsVisible

  ngOnInit() {
    this.purchaseService.fetch()
  }

  startNewPurchase() {
    this.context.startNewPurchase()
  }

  hideForm() {
    this.context.hideForm()
  }
}
