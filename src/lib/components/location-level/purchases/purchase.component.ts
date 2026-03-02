import {Component, computed, effect, inject, OnInit, signal, untracked} from '@angular/core'
import {Button} from 'primeng/button'
import {Purchase} from '../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../api/location-level/purchase/purchase.service'
import {PurchaseFormComponent} from './purchase-form/purchase-form.component'
import {PurchaseGridComponent} from './purchase-form/purchase-grid/purchase-grid.component'

@Component({
  selector: 'rts-purchases',
  templateUrl: 'purchase.component.html',
  imports: [
    Button,
    PurchaseGridComponent,
    PurchaseFormComponent
  ]
})
export class PurchaseComponent implements OnInit {
  private readonly purchaseService = inject(PurchaseService)

  readonly selectedPurchase = signal<Purchase | null>(null)
  readonly isCreating = signal(false)
  readonly formIsVisible = computed(() => this.selectedPurchase() !== null || this.isCreating())

  constructor() {
    effect(() => {
      const saved = this.purchaseService.lastSavedResponse()
      if (!saved) return
      untracked(() => {
        if (this.isCreating()) {
          this.selectedPurchase.set(saved)
          this.isCreating.set(false)
        } else if (this.selectedPurchase()?.id === saved.id) {
          this.selectedPurchase.set(saved)
        }
      })
    })
  }

  ngOnInit() {
    this.purchaseService.fetch()
  }

  onEditPurchase(purchase: Purchase) {
    this.selectedPurchase.set(purchase)
  }

  startNewPurchase() {
    this.selectedPurchase.set(null)
    this.isCreating.set(true)
  }

  clearSelectedPurchase() {
    this.selectedPurchase.set(null)
    this.isCreating.set(false)
  }
}
