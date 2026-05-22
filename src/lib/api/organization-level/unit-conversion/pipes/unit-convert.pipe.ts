import {inject, Pipe, PipeTransform} from '@angular/core'
import {ConversionContext, HasUnitFields} from '../conversion-context.model'
import {UnitConversionService} from '../unit-conversion.service'

@Pipe({ name: 'buildConversionContext', standalone: true })
export class ConversionContextPipe<T extends HasUnitFields> implements PipeTransform {

  transform(sourceUnitId: string, line: T, value?: number): ConversionContext {
    return {
      value: value ?? 0,
      sourceUnitId,
      targetUnitId: line.baseUnitId,
      snapshotUnitId: line.snapshotUnitId,
      conversionFactor: line.conversionFactor
    }
  }
}

@Pipe({name: 'unitFactorResolver', standalone: true})
export class UnitFactorResolver implements PipeTransform {
  private readonly unitConversionService = inject(UnitConversionService)

  transform(sourceUnitId: string, targetUnitId: string): number {
    const context: ConversionContext = {sourceUnitId, targetUnitId, value: 0, conversionFactor: 1}
    return this.unitConversionService.resolveFactor(context) ?? 0
  }
}

@Pipe({name: 'unitConversionDescriptor', standalone: true})
export class UnitConversionDescriptorPipe implements PipeTransform {
  private readonly unitConversionService = inject(UnitConversionService)

  transform(conversionContext: ConversionContext): string {
    return this.unitConversionService.describeConversion(conversionContext)
  }
}

@Pipe({name: 'convertToTargetUnitForDisplay', standalone: true})
export class UnitConvertPipe implements PipeTransform {
  private readonly unitConversionService = inject(UnitConversionService)

  transform(conversionContext: ConversionContext): string {
    return this.unitConversionService.convertToTargetUnitForDisplay(conversionContext)
  }
}

@Pipe({name: 'convertToTargetUnitValue', standalone: true})
export class UnitConvertRawValuePipe implements PipeTransform {
  private readonly unitConversionService = inject(UnitConversionService)

  transform(conversionContext: ConversionContext): number  {
    return this.unitConversionService.convertToTargetUnitValue(conversionContext) ?? 0
  }
}

@Pipe({name: 'convertToTargetUnitAsCurrency', standalone: true})
export class UnitCurrencyPipe implements PipeTransform {
  private readonly unitConversionService = inject(UnitConversionService)

  transform(conversionContext: ConversionContext): string {
    return this.unitConversionService.convertToTargetUnitAsCurrency(conversionContext)
  }
}
