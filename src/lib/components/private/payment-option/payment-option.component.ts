import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NullSafePipe } from 'lib/utils/pipes/null-safe.pipe';
import { NullishToZeroPipe } from 'lib/utils/pipes/nullish-to-zero.pipe';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AddRowComponent } from 'lib/components/reusable/add-row/add-row.component';
import { PaymentOptionService } from 'lib/api/payment-option/payment-option.service';
import { HasGridComponent } from 'lib/components/reusable/has-grid.component';
import { PaymentOptionFormComponent } from './payment-option-form/payment-option-form.component';

@Component({
  standalone: true,
  selector: 'rts-payment-option',
  templateUrl: 'payment-option.component.html',
  imports: [
    TableModule,
    AsyncPipe,
    NullishToZeroPipe,
    NullSafePipe,
    Button,
    PaymentOptionFormComponent,
    AddRowComponent
  ],
})
export class PaymentOptionComponent extends HasGridComponent<PaymentOptionService> {
  private readonly paymentOptionService = inject(PaymentOptionService)
  readonly loading$ = this.paymentOptionService.selectLoading$()
  readonly processingIsUnderWay$ = this.paymentOptionService.processingIsUnderWay$()
  readonly paymentOptions$ = this.paymentOptionService.selectAll$()

  readonly apiService = this.paymentOptionService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
}
