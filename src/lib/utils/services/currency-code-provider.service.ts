import {DEFAULT_CURRENCY_CODE, inject, Injectable} from '@angular/core'

@Injectable({providedIn: 'root'})
export class CurrencyCodeProviderService {
  private readonly _currencyCode = inject(DEFAULT_CURRENCY_CODE)

  get currencyCode(): string {
    return this._currencyCode?.trim()
  }
}
