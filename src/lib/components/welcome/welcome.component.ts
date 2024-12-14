import {Component} from '@angular/core'
import {RouterLink, RouterOutlet} from '@angular/router'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Divider} from 'primeng/divider'

@Component({
    standalone: true,
    selector: 'rts-welcome',
    templateUrl: 'welcome.component.html',
    imports: [RouterOutlet, Divider, Card, Button, RouterLink]
})
export class WelcomeComponent {
}
