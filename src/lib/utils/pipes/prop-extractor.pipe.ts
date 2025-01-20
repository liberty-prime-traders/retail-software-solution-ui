import {Pipe, PipeTransform} from '@angular/core'
import {isNil} from 'lodash-es'

@Pipe({name: 'propExtractor', standalone: true})
export class PropExtractorPipe implements PipeTransform {
	
	transform<T>(value: T | T[], prop: keyof T): any {
		if (isNil(prop)) {
			return null
		}
		if (Array.isArray(value)) {
			return value?.map(x => x[prop])
		}
		return value[prop]
	}
}
