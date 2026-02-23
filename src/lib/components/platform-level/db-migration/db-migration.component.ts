import {Component} from '@angular/core'
import {RouterLink, RouterOutlet} from '@angular/router'
import {TabsModule} from 'primeng/tabs'

@Component({
  selector: 'rts-db-migration',
  templateUrl: './db-migration.component.html',
  imports: [
    TabsModule,
    RouterOutlet,
    RouterLink
  ]
})
export class DbMigrationComponent {}
