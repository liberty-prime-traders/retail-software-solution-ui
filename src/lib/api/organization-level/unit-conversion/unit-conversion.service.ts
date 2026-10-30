import {CurrencyPipe} from '@angular/common'
import {inject, Injectable} from '@angular/core'
import {RoundNumbersPipe} from '../../../utils/pipes/round-numbers.pipe'
import {ConversionContext} from './conversion-context.model'
import {UnitConversionGraphService} from './unit-conversion-graph.service'
import {UnitPluralDerivation} from './unit-plural-derivation.enum'

@Injectable({providedIn: 'root'})
export class UnitConversionService {

  private readonly currencyPipe = inject(CurrencyPipe)
  private readonly graphService = inject(UnitConversionGraphService)

  convertToTargetUnitForDisplay(ctx: ConversionContext): string {
    if (ctx.value === 0) return '_'
    let converted = this.convertToTargetUnitValue(ctx)
    converted = RoundNumbersPipe.prototype.transform(converted, 4)
    if (converted === null) return '_'
    return `${converted} ${this.getUnitLabelFromValue(ctx.targetUnitId, converted)}`
  }

  convertToTargetUnitValue(ctx: ConversionContext): number | null {
    return this.applyConversion(ctx, (sourceValue, factor) => sourceValue * factor)
  }

  private getUnitLabelFromValue(unitId: string, value: number): string {
    return this.graphService.getUnitLabel(unitId, UnitPluralDerivation.FROM_VALUE, value)
  }

  convertToTargetUnitAsCurrency(ctx: ConversionContext): string {
    if (ctx.value === 0) return 'KES 0.00'
    const converted = this.convertPerUnit(ctx)
    if (converted === null) return '_'
    return `${this.transformToCurrency(converted)}/${this.getUnitLabelSingular(ctx.targetUnitId)}`
  }

  getUnitLabelSingular(unitId: string): string {
    return this.graphService.getUnitLabel(unitId, UnitPluralDerivation.SINGULAR)
  }

  private convertPerUnit(ctx: ConversionContext): number | null {
    return this.applyConversion(ctx, (sourceValue, factor) => sourceValue / factor)
  }

  private transformToCurrency(value: number): string {
    return this.currencyPipe.transform(value, 'KES ') ?? '_'
  }

  private applyConversion(
    ctx: ConversionContext,
    operation: (sourceValue: number, factor: number) => number
  ): number | null {
    if (ctx.value === 0) return 0
    if (ctx.sourceUnitId === ctx.targetUnitId) return ctx.value
    const factor = this.resolveFactor(ctx)
    return factor == null ? null : operation(ctx.value, factor)
  }

  resolveFactor(ctx: ConversionContext): number | null {
    if (ctx.snapshotUnitId && ctx.conversionFactor && ctx.snapshotUnitId === ctx.sourceUnitId) {
      return ctx.conversionFactor
    }
    return this.graphService.getTargets(ctx.sourceUnitId)?.get(ctx.targetUnitId)?.factor ?? null
  }

  describeConversion(ctx: ConversionContext): string {
    if (ctx.sourceUnitId === ctx.targetUnitId) return 'Base unit selected'

    let resolvedFactor = this.resolveFactor(ctx)
    if (!resolvedFactor) return '_'

    const sourceLabel = this.getUnitLabelSingular(ctx.sourceUnitId)
    const targetLabel = this.graphService.getUnitLabel(ctx.targetUnitId, UnitPluralDerivation.PLURAL)

    resolvedFactor = RoundNumbersPipe.prototype.transform(resolvedFactor, 4)
    return `1 ${sourceLabel} = ${resolvedFactor} ${targetLabel}`
  }
}
