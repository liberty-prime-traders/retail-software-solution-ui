import {Injector, runInInjectionContext, signal} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {form} from '@angular/forms/signals'
import {
  defaultJsonPayloadFormModel,
  jsonNonEmptyArrayPayloadSchema,
  jsonPayloadSchema,
  JsonPayloadFormModel,
  parseJsonPayload
} from './json-payload'

describe('json payload', () => {
  const errorKindsFor = (payload: string, payloadSchema: typeof jsonPayloadSchema) => {
    const payloadForm = runInInjectionContext(TestBed.inject(Injector), () =>
      form(signal<JsonPayloadFormModel>({payload}), payloadSchema)
    )
    return payloadForm.payload().errors().map(error => error.kind)
  }

  it('requires a payload', () => {
    expect(errorKindsFor('', jsonPayloadSchema)).toEqual(['required'])
    expect(errorKindsFor(defaultJsonPayloadFormModel.payload, jsonPayloadSchema)).toEqual(['required'])
  })

  it('rejects text that is not JSON', () => {
    expect(errorKindsFor('[{', jsonPayloadSchema)).toEqual(['invalidJson'])
  })

  it('accepts any valid JSON for the plain schema', () => {
    expect(errorKindsFor('{"a": 1}', jsonPayloadSchema)).toEqual([])
  })

  it('requires a non-empty array for the array schema', () => {
    expect(errorKindsFor('{"a": 1}', jsonNonEmptyArrayPayloadSchema)).toEqual(['notNonEmptyArray'])
    expect(errorKindsFor('[]', jsonNonEmptyArrayPayloadSchema)).toEqual(['notNonEmptyArray'])
    expect(errorKindsFor('[{"a": 1}]', jsonNonEmptyArrayPayloadSchema)).toEqual([])
  })

  it('reports invalid JSON once for the array schema', () => {
    expect(errorKindsFor('[{', jsonNonEmptyArrayPayloadSchema)).toEqual(['invalidJson'])
  })

  it('parses a payload into the requested type', () => {
    expect(parseJsonPayload<{a: number}[]>('[{"a": 1}]')).toEqual([{a: 1}])
  })
})
