import {HttpClient} from '@angular/common/http'
import {inject, Injectable, signal} from '@angular/core'
import {finalize, Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {UnitConversionGraph, UnitConversionTarget} from './unit-conversion-target.model'
import {UnitPluralDerivation} from './unit-plural-derivation.enum'

@Injectable({providedIn: 'root'})
export class UnitConversionGraphService {
  private readonly absolutePath = '/secured/unit-conversions/graph'
  private readonly httpClient = inject(HttpClient)

  private readonly graphIsLoading = signal(false)
  private readonly graph: UnitConversionGraph = new Map()
  readonly isLoading = this.graphIsLoading.asReadonly()

  constructor() {
    this.fetchGraph()
  }

  getTargets(sourceUnitId: string): Map<string, UnitConversionTarget> | undefined {
    return this.graph.get(sourceUnitId)
  }

  getUnitLabel(unitId: string, pluralConvention: UnitPluralDerivation, value?: number): string {
    const target = this.graph.get(unitId)?.get(unitId)
    if (!target) return '_'

    const usePlural = pluralConvention === UnitPluralDerivation.PLURAL
      || (pluralConvention === UnitPluralDerivation.FROM_VALUE && value !== undefined && value !== 1)
    return usePlural ? `${target.name}s` : target.name
  }

  private fetchGraph(): Subscription {
    if (this.graph.size > 0) {
      return new Subscription()
    }
    this.graphIsLoading.set(true)
    return this.httpClient.get<UnitConversionGraph>(this.absolutePath).pipe(
      tap(graph => {
        this.graph.clear()
        Object.entries(graph).forEach(([unitId, targets]) => {
          const targetMap = new Map<string, UnitConversionTarget>()
          Object.entries(targets).forEach(([targetId, target]) => {
            targetMap.set(targetId, target as UnitConversionTarget)
          })
          this.graph.set(unitId, targetMap)
        })
      }),
      finalize(() => this.graphIsLoading.set(false))
    ).subscribe()
  }

}
