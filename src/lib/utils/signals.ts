import {Signal} from '@angular/core'
import {toObservable, toSignal} from '@angular/core/rxjs-interop'
import {debounceTime, distinctUntilChanged, startWith} from 'rxjs'

export const debouncedSignal = <T>(sourceSignal: Signal<T>, debounceTimeInMs = 0,): Signal<T> => {
  const source$ = toObservable(sourceSignal)
  const debounced$ = source$.pipe(startWith(sourceSignal()), debounceTime(debounceTimeInMs), distinctUntilChanged())
  return toSignal(debounced$, {
    initialValue: sourceSignal(),
  })
}
