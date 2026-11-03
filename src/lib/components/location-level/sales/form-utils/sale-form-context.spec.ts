import {TestBed} from '@angular/core/testing'
import {defaultSaleSession} from '../../../../api/location-level/sale_session/sale-session-default.value'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {SaleFormContext} from './sale-form-context'

describe('SaleFormContext auto print', () => {
  let context: SaleFormContext

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: SaleSessionService, useValue: {}}]
    })
    context = TestBed.inject(SaleFormContext)
  })

  it('asks for a print once a sale is confirmed', () => {
    context.loadConfirmedSession(defaultSaleSession())

    expect(context.autoPrintAfterConfirm()).toBeTrue()
  })

  it('stops asking once the print has been started', () => {
    context.loadConfirmedSession(defaultSaleSession())

    context.markAutoPrinted()

    expect(context.autoPrintAfterConfirm()).toBeFalse()
  })

  it('does not ask for a print when an ordinary session is loaded', () => {
    context.loadConfirmedSession(defaultSaleSession())

    context.loadSession(defaultSaleSession())

    expect(context.autoPrintAfterConfirm()).toBeFalse()
  })
})
