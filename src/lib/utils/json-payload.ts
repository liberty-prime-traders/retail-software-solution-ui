import {apply, required, schema, validate} from '@angular/forms/signals'

export interface JsonPayloadFormModel {
  payload: string
}

export const jsonPayloadFieldMap = new Map<keyof JsonPayloadFormModel, string>([['payload', 'Payload']])

export const defaultJsonPayloadFormModel: JsonPayloadFormModel = {payload: ''}

const tryParse = (payload: string): {parsed?: unknown, errorMessage?: string} => {
  try {
    return {parsed: JSON.parse(payload)}
  } catch (error) {
    return {errorMessage: (error as Error).message}
  }
}

export const jsonPayloadSchema = schema<JsonPayloadFormModel>((path) => {
  required(path.payload, {message: 'Provide a JSON payload'})
  validate(path.payload, ({value}) => {
    const payload = value()
    if (!payload.trim()) return null
    const {errorMessage} = tryParse(payload)
    return errorMessage ? {kind: 'invalidJson', message: `Invalid JSON: ${errorMessage}`} : null
  })
})

export const jsonNonEmptyArrayPayloadSchema = schema<JsonPayloadFormModel>((path) => {
  apply(path, jsonPayloadSchema)
  validate(path.payload, ({value}) => {
    const payload = value()
    if (!payload.trim()) return null
    const {parsed, errorMessage} = tryParse(payload)
    if (errorMessage) return null
    return Array.isArray(parsed) && parsed.length > 0
      ? null
      : {kind: 'notNonEmptyArray', message: 'Expected a non-empty JSON array'}
  })
})

export const parseJsonPayload = <T> (payload: string): T => JSON.parse(payload) as T
