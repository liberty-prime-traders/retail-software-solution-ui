import {effect, EffectRef, Signal, untracked} from '@angular/core'
import {toObservable, toSignal} from '@angular/core/rxjs-interop'
import {debounceTime, distinctUntilChanged, startWith} from 'rxjs'

export const debouncedSignal = <T>(sourceSignal: Signal<T>, debounceTimeInMs = 0,): Signal<T> => {
  const source$ = toObservable(sourceSignal)
  const debounced$ = source$.pipe(startWith(sourceSignal()), debounceTime(debounceTimeInMs), distinctUntilChanged())
  return toSignal(debounced$, {
    initialValue: sourceSignal(),
  })
}

/**
 * Runs `onChange` whenever `source` changes, skipping the value it already holds when this is called
 * (an `effect` always runs once immediately on creation — this just ignores that first run).
 * Use this to react to an explicit domain event (e.g. a "data mutated" counter signal) rather than
 * inferring one from unrelated UI state — and to force a reload that the usual change-detected
 * `refetch` would skip because the filter params themselves never changed.
 */
export const runOnSignalChange = <T>(source: Signal<T>, onChange: () => void): EffectRef => {
  let isFirstRun = true
  return effect(() => {
    source()
    if (isFirstRun) {
      isFirstRun = false
      return
    }
    untracked(onChange)
  })
}
