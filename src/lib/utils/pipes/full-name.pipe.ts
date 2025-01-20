import {Pipe, PipeTransform} from '@angular/core'
import {SysUser} from '../../api/sys-user/sys-user.model'

@Pipe({name: 'fullName', standalone: true})
export class FullNamePipe implements PipeTransform {
	
	transform(user?: SysUser): string {
		return user ?`${user?.firstName} ${user?.lastName}` : '--'
	}
	
}
