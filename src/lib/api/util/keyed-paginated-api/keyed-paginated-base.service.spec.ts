import {provideHttpClient} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {signal} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {ContactLedgerEntry} from '../../organization-level/contact-ledger/contact-ledger-entry.model'
import {ContactLedgerService} from '../../organization-level/contact-ledger/contact-ledger.service'
import {PageResponse} from '../paginated-api/page-response.model'

describe('KeyedPaginatedBaseService', () => {
  let service: ContactLedgerService
  let http: HttpTestingController

  const entry = (id: string, _contactId: string) => ({id, sourceReferenceNumber: id} as ContactLedgerEntry)
  const page = (
    contents: ContactLedgerEntry[],
    currentCursor: string,
    hasMore: boolean
  ): PageResponse<ContactLedgerEntry> => ({contents, currentCursor, hasMore, requireClientSideFilter: false})
  const url = (key: string) => `/secured/contacts/${key}/ledger`

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]})
    service = TestBed.inject(ContactLedgerService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('requests the first page with the default cursor', () => {
    service.ensureLoaded('A', {})
    const request = http.expectOne(url('A'))
    expect(request.request.method).toBe('POST')
    expect(request.request.body).toEqual({previousCursor: '', requestedSize: 100, parameters: {}})
    request.flush(page([entry('a1', 'A')], 'a1', true))
  })

  it('does not refetch a previously visited key and continues from its own cursor', () => {
    const key = signal<string | undefined>('A')
    const entries = service.selectForKey(key)

    service.ensureLoaded('A', {})
    http.expectOne(url('A')).flush(page([entry('a1', 'A'), entry('a2', 'A')], 'a2', true))
    service.ensureLoaded('B', {})
    http.expectOne(url('B')).flush(page([entry('b1', 'B')], 'b1', false))

    key.set('B')
    expect(entries().map(e => e.id)).toEqual(['b1'])

    key.set('A')
    expect(service.ensureLoaded('A', {})).toBeUndefined()
    http.expectNone(url('A'))
    expect(entries().filter(e => !e.placeholder).map(e => e.id)).toEqual(['a1', 'a2'])

    service.loadNext('A')
    const next = http.expectOne(url('A'))
    expect(next.request.body.previousCursor).toBe('a2')
    next.flush(page([entry('a3', 'A')], 'a3', false))
    expect(entries().map(e => e.id)).toEqual(['a1', 'a2', 'a3'])
    expect(service.loadNext('A')).toBeUndefined()
  })

  it('does not fire a second page request while one is in flight', () => {
    service.ensureLoaded('A', {})
    http.expectOne(url('A')).flush(page([entry('a1', 'A')], 'a1', true))
    service.loadNext('A')
    expect(service.loadNext('A')).toBeUndefined()
    http.expectOne(url('A')).flush(page([entry('a2', 'A')], 'a2', false))
  })

  it('keeps a response for key A out of key B when the user navigates away mid-request', () => {
    const keyB = signal<string | undefined>('B')
    service.ensureLoaded('A', {})
    service.ensureLoaded('B', {})
    http.expectOne(url('B')).flush(page([entry('b1', 'B')], 'b1', false))
    http.expectOne(url('A')).flush(page([entry('a1', 'A')], 'a1', false))
    expect(service.selectForKey(keyB)().map(e => e.id)).toEqual(['b1'])
    expect(service.getLoadedCount('A')).toBe(1)
  })

  it('refetches when the parameters change and ignores the response of the replaced request', () => {
    service.ensureLoaded('A', {})
    const stale = http.expectOne(url('A'))
    service.ensureLoaded('A', {entryDateFrom: '2026-01-01'})
    const fresh = http.expectOne(url('A'))
    stale.flush(page([entry('old', 'A')], 'old', false))
    fresh.flush(page([entry('new', 'A')], 'new', false))
    expect(service.getLoadedCount('A')).toBe(1)
    expect(service.selectForKey(signal('A'))()[0].id).toBe('new')
  })

  it('retries the first page on the next visit after it failed', () => {
    service.ensureLoaded('A', {})
    http.expectOne(url('A')).flush({message: 'failure'}, {status: 500, statusText: 'Server Error'})
    expect(service.ensureLoaded('A', {})).toBeDefined()
    http.expectOne(url('A')).flush(page([entry('a1', 'A')], 'a1', false))
    expect(service.getLoadedCount('A')).toBe(1)
  })

  it('keeps loaded rows and allows retrying the next page when it failed', () => {
    service.ensureLoaded('A', {})
    http.expectOne(url('A')).flush(page([entry('a1', 'A')], 'a1', true))
    service.loadNext('A')
    http.expectOne(url('A')).flush({message: 'failure'}, {status: 500, statusText: 'Server Error'})
    expect(service.getLoadedCount('A')).toBe(1)
    service.loadNext('A')
    expect(http.expectOne(url('A')).request.body.previousCursor).toBe('a1')
  })
})
