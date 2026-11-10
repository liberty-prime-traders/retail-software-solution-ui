import {ZonedDatesService} from '../../../utils/services/zoned-dates.service'
import {BulkPaymentFormDefinition} from './bulk-payment-form.definition'

describe('BulkPaymentFormDefinition', () => {
  const zonedDatesService = {pickedDateAtOrgZone: (date?: Date | null) => date ? date.toISOString() : ''} as ZonedDatesService
  const day = (month: number, dayOfMonth: number) => new Date(2026, month - 1, dayOfMonth)

  it('treats "ordered to" as inclusive by searching before the start of the following day', () => {
    const searchRequest = BulkPaymentFormDefinition.convertToSearchRequest(
      {...BulkPaymentFormDefinition.createDefaultBulkPaymentFormModel(), supplierId: 'supplier', orderedFrom: day(11, 1), orderedTo: day(11, 9)},
      zonedDatesService
    )

    expect(searchRequest).toEqual({
      supplierId: 'supplier', orderedFrom: day(11, 1).toISOString(), orderedBefore: day(11, 10).toISOString()
    })
  })

  it('defaults to the last six months, which the server accepts', () => {
    const formValue = BulkPaymentFormDefinition.createDefaultBulkPaymentFormModel()

    expect(formValue.orderedFrom).not.toBeNull()
    expect(formValue.orderedTo).not.toBeNull()
    expect(BulkPaymentFormDefinition.hasSearchableRange(formValue)).toBeTrue()
  })

  it('refuses to search without both dates or over a range the server rejects', () => {
    const defaults = BulkPaymentFormDefinition.createDefaultBulkPaymentFormModel()

    expect(BulkPaymentFormDefinition.hasSearchableRange({...defaults, orderedFrom: null})).toBeFalse()
    expect(BulkPaymentFormDefinition.hasSearchableRange({...defaults, orderedTo: null})).toBeFalse()
    expect(BulkPaymentFormDefinition.hasSearchableRange(
      {...defaults, orderedFrom: day(1, 1), orderedTo: new Date(2027, 0, 5)}
    )).toBeFalse()
    expect(BulkPaymentFormDefinition.hasSearchableRange(
      {...defaults, orderedFrom: day(11, 9), orderedTo: day(11, 1)}
    )).toBeFalse()
  })

  it('accepts a full calendar year, including a leap year, and rejects one day more', () => {
    const defaults = BulkPaymentFormDefinition.createDefaultBulkPaymentFormModel()

    expect(BulkPaymentFormDefinition.hasSearchableRange(
      {...defaults, orderedFrom: new Date(2028, 0, 1), orderedTo: new Date(2028, 11, 31)}
    )).toBeTrue()
    expect(BulkPaymentFormDefinition.hasSearchableRange(
      {...defaults, orderedFrom: new Date(2027, 0, 1), orderedTo: new Date(2027, 11, 31)}
    )).toBeTrue()
    expect(BulkPaymentFormDefinition.hasSearchableRange(
      {...defaults, orderedFrom: new Date(2027, 0, 1), orderedTo: new Date(2028, 0, 1)}
    )).toBeFalse()
  })

  it('sends blank notes as absent and the selected purchases as given', () => {
    const createRequest = BulkPaymentFormDefinition.convertToCreateRequest(
      {
        ...BulkPaymentFormDefinition.createDefaultBulkPaymentFormModel(),
        supplierId: 'supplier', paymentMethodId: 'method', amount: 75, paymentDate: day(11, 9)
      },
      ['a', 'b'], zonedDatesService
    )

    expect(createRequest).toEqual({
      supplierId: 'supplier', purchaseIds: ['a', 'b'], amount: 75, paymentMethodId: 'method',
      paymentDate: day(11, 9).toISOString(), notes: undefined
    })
  })
})
