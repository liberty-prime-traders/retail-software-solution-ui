import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
    name: 'kshCurrency',
    standalone: true
})
export class KshCurrencyPipe implements PipeTransform {
    transform(value: number | string): string | null {
        if (value == null) return '--'

        const numberValue = parseFloat(value.toString())
        if (isNaN(numberValue)) return '--'

        return `${numberValue.toLocaleString('en-KE', {
            style: 'currency',
            currency: 'KES',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).replace('KSh', '')}`
    }
}
