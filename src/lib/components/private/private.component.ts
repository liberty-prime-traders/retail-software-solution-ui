import {Component, inject, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {SysUserService} from '../../api/sys-user/sys-user.service'
import {NavigationComponent} from './navigation/navigation.component'

@Component({
    standalone: true,
    selector: 'rts-private',
    imports: [
        RouterOutlet,
        Card,
        NavigationComponent,
        Button
    ],
    templateUrl: 'private.component.html'
})
export class PrivateComponent implements OnInit {
    private readonly userService = inject(SysUserService)

    showNavigation = true

    ngOnInit() {
        this.userService.post()
    }
}
