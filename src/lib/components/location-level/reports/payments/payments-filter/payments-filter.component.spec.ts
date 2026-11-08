import {provideHttpClient} from '@angular/common/http'
import {provideHttpClientTesting} from '@angular/common/http/testing'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {TIMEZONE_TOKEN} from '@global/utils/timezones.config'
import {PaymentType} from '../../../../../api/location-level/payment/payment-type.enum'
import {PaymentsFilterComponent} from './payments-filter.component'
import {PaymentsFilterFormDefinition} from './payments-filter-form.definition'
import {PaymentsFilterState} from './payments-filter.state'

describe('PaymentsFilterComponent', () => {
  let fixture: ComponentFixture<PaymentsFilterComponent>
  let state: PaymentsFilterState

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? ''

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), {provide: TIMEZONE_TOKEN, useValue: 'UTC'}]
    })
    state = TestBed.inject(PaymentsFilterState)
    fixture = TestBed.createComponent(PaymentsFilterComponent)
    fixture.detectChanges()
  })

  it('defaults to both types checked and renders the Type checkboxes', () => {
    expect(state.filterFormValue().selectedTypes).toEqual([PaymentType.SALE, PaymentType.PURCHASE])
    expect(text()).toContain('Type')
    expect(fixture.nativeElement.querySelector('#type0')).not.toBeNull()
    expect(fixture.nativeElement.querySelector('#type1')).not.toBeNull()
  })

  it('labels the contact filter Contacts and has a Purchase reference numbers section', () => {
    expect(text()).toContain('Contacts')
    expect(text()).not.toContain('Customers')
    expect(text()).toContain('Sale reference numbers')
    expect(text()).toContain('Purchase reference numbers')
  })

  it('adds and removes purchase reference numbers independently of sale references', () => {
    state.addReferenceNumbers(PaymentType.PURCHASE, 'PU000001, PU000002')
    state.addReferenceNumbers(PaymentType.SALE, 'SL000001')
    state.removeReferenceNumber(PaymentType.PURCHASE, 'PU000001')

    const {referenceNumbersByType} = state.filterFormValue()
    expect(referenceNumbersByType[PaymentType.PURCHASE]).toEqual(['PU000002'])
    expect(referenceNumbersByType[PaymentType.SALE]).toEqual(['SL000001'])
  })

  it('sends reference numbers keyed by type and omits types without any', () => {
    state.addReferenceNumbers(PaymentType.PURCHASE, 'PU000001')

    const params = PaymentsFilterFormDefinition.convertToFilterParams(state.filterFormValue(), {atOrgZone: () => ''} as never)
    expect(params.referenceNumbersByType).toEqual({[PaymentType.PURCHASE]: ['PU000001']})
  })

  it('sends an empty types array when no type is checked', () => {
    state.filterForm.selectedTypes().value.set([])

    const params = PaymentsFilterFormDefinition.convertToFilterParams(state.filterFormValue(), {atOrgZone: () => ''} as never)
    expect(params.types).toEqual([])
  })

  it('resets types, contacts and reference numbers', () => {
    state.filterForm.selectedTypes().value.set([PaymentType.SALE])
    state.addReferenceNumbers(PaymentType.PURCHASE, 'PU000001')
    state.filterForm.contactIds().value.set(['c1'])

    state.resetFilters()

    expect(state.filterFormValue().selectedTypes).toEqual([PaymentType.SALE, PaymentType.PURCHASE])
    expect(state.filterFormValue().referenceNumbersByType[PaymentType.PURCHASE]).toEqual([])
    expect(state.filterFormValue().contactIds).toEqual([])
  })
})
