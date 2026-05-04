import {applyWhen, disabled, max, required, RootFieldContext, schema, SchemaPath} from '@angular/forms/signals'
import {SalePayment} from '../../../../api/location-level/sale-payment/sale-payment.model'
import {Sale, SaleLine, SalePaymentRecord} from '../../../../api/location-level/sale/sale.model'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {SaleLineFormDefinition} from './sale-line-form.definition'

export namespace SaleFormDefinition {

  export interface SaleFormModel {
    id: string,
    contactId: string
    walkInCustomer: boolean | null
    lines: SaleLineFormDefinition.SaleLineModel[]
    orderTotal: number
    totalPaid: number
    balanceDue: number
  }

  export const fieldMap: Map<string, string> = new Map([
    ['contactId', 'Customer'],
    ['walkInCustomer', 'Walk-in Customer'],
    ['lines', 'Sale Lines'],
    ['orderTotal', 'Order Total'],
    ['totalPaid', 'Total Paid'],
    ['balanceDue', 'Balance Due']
  ])

  export const createDefault = (): SaleFormModel => ({
    id: '',
    contactId: '',
    walkInCustomer: null,
    lines: [],
    orderTotal: 0,
    totalPaid: 0,
    balanceDue: 0
  })

  export const saleFormSchema = schema<SaleFormModel>((path) => {
    applyWhen(
      path.contactId,
      ({valueOf}: RootFieldContext<string>) => !valueOf(path.walkInCustomer),
      (contactIdPath: SchemaPath<string>) => required(contactIdPath)
    )

    disabled(
      path.contactId,
      ({valueOf}: RootFieldContext<string>) => !!valueOf(path.walkInCustomer)
    )

    max(
      path.balanceDue,
      ({valueOf}) => valueOf(path.walkInCustomer) ? 0 : valueOf(path.orderTotal),
      {message: 'Walk-in customers must pay in full'}
    )

    max(
      path.totalPaid,
      ({valueOf}) => valueOf(path.orderTotal),
      {message: 'Total paid cannot exceed order total'}
    )
  })

  export const convertToFormModel = (sale: Sale | null): SaleFormModel => {
    if (!sale) return createDefault()
    const totalPaid = (sale.payments ?? []).reduce(
      (sum, p) => sum + (p.amount ?? 0), 0
    )
    return {
      id: sale.id as string ?? '',
      contactId: sale.contactId ?? '',
      walkInCustomer: sale.walkInCustomer ?? null,
      lines: SaleLineFormDefinition.convertLinesToFormModel(sale.lines),
      totalPaid,
      orderTotal: sale.saleTotal ?? 0,
      balanceDue: (sale.saleTotal ?? 0) - totalPaid
    }
  }

  export const convertToBackendModel = (
    formValue: SaleFormModel,
    paymentsInput: Partial<SalePayment>[],
    zonedDatesService: ZonedDatesService
  ): Partial<Sale> => {

    const lines: Partial<SaleLine>[] = formValue.lines.map(line => ({
      id: line.id,
      locationProductId: line.locationProductId,
      quantity: line.quantity,
      unitId: line.unitId,
      unitPrice: line.unitPrice
    }))

    const payments: Partial<SalePaymentRecord>[] = paymentsInput
      .filter(p => p.amount && p.paymentMethodId)
      .map(p => ({
        paymentMethodId: p.paymentMethodId,
        amount: p.amount,
        reference: p.reference,
        paymentDate: zonedDatesService.toZonedISOString(p.paymentDateFormModel)
      }))

    return {
      id: formValue.id,
      linesToAdd: lines.filter(l => !l.id),
      linesToUpdate: lines.filter(l => l.id),
      payments,
      contactId: formValue.contactId,
      walkInCustomer: !!formValue.walkInCustomer,
    }
  }
}
