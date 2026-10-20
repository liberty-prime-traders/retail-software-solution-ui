import {HttpRequest} from '@angular/common/http'
import {signal} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {HttpHandler} from '@angular/common/http'
import {of} from 'rxjs'
import {NavigationScope} from '../../lib/components/welcome/top-navigation/navigation-scope.model'
import {UserContextService} from '../../lib/utils/services/auth/user-context.service'
import {SessionContextService} from '../../lib/utils/services/session-context.service'
import {RtsHttpInterceptor} from './rts-http.interceptor'

describe('RtsHttpInterceptor location header', () => {
  const selectedScope = signal(NavigationScope.ORG)
  const location = {id: 'loc-1'}
  let sentRequest: HttpRequest<unknown>

  const send = () => {
    const handler = {handle: (request: HttpRequest<unknown>) => { sentRequest = request; return of() }} as HttpHandler
    TestBed.inject(RtsHttpInterceptor).intercept(new HttpRequest('GET', '/secured/anything'), handler).subscribe()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RtsHttpInterceptor,
        {provide: UserContextService, useValue: {token: () => 'token'}},
        {
          provide: SessionContextService,
          useValue: {selectedScope, selectedOrganization: () => ({id: 'org-1'}), selectedLocation: () => location}
        }
      ]
    })
  })

  it('sends the selected location only while the location scope is active', () => {
    selectedScope.set(NavigationScope.LOCATION)
    send()
    expect(sentRequest.headers.get('X-LOCATION-ID')).toBe('loc-1')

    selectedScope.set(NavigationScope.ORG)
    send()
    expect(sentRequest.headers.get('X-LOCATION-ID')).toBe('')
  })
})
