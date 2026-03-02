import {Component, inject, input, Input, OnInit} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {Purchase} from '../../../../api/location-level/purchase/purchase.model'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {PurchaseFormContext} from './form-utils/purchase-form-context'
import {PurchaseFormGeneralFieldsComponent} from './general-fields/general-fields.component'
import {PurchaseLinesComponent} from './purchase-lines/purchase-lines.component'

@Component({
  selector: 'rts-purchase-form',
  templateUrl: 'purchase-form.component.html',
  styleUrl: 'purchase-form.component.scss',
  providers: [PurchaseFormContext],
  imports: [
    FormsModule,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    PurchaseLinesComponent,
    AutoStretchDirective,
    Button,
    LoadingContainerComponent,
    PurchaseFormGeneralFieldsComponent
  ]
})
export class PurchaseFormComponent implements OnInit {

  private readonly purchaseService = inject(PurchaseService)
  private readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly purchaseForm = this.purchaseFormContext.purchaseForm
  readonly isCreating = input(false)

  @Input()
  set purchase(purchase: Purchase | null) {
    this.purchaseFormContext.initializeForm(purchase)
  }

  readonly purchaseIsLoading = this.purchaseService.selectLoading

  ngOnInit() {
    this.purchaseService.fetch()
  }

  resetForm() {
    this.purchaseFormContext.resetForm()
  }

  saveDraft() {
    const updated = this.purchaseFormContext.getSavableFormValue()
    if (updated.id) {
      this.purchaseService.put(updated)
    } else {
      this.purchaseService.post(updated)
    }
  }
}
