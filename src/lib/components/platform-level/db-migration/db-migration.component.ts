import {Component} from '@angular/core'
import {RouterLink, RouterOutlet} from '@angular/router'
import {Divider} from 'primeng/divider'
import {TabsModule} from 'primeng/tabs'
import {Card} from 'primeng/card'

@Component({
  selector: 'rts-db-migration',
  templateUrl: './db-migration.component.html',
  imports: [
    TabsModule,
    RouterOutlet,
    Divider,
    RouterLink,
    Card
  ]
})
export class DbMigrationComponent {}
