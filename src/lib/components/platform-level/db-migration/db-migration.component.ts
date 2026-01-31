import {Component} from '@angular/core'
import {RouterLink, RouterOutlet} from '@angular/router'
import {TabsModule} from 'primeng/tabs'
import {AutoStretchComponent} from '../../reusable/auto-stretch.component'

@Component({
  selector: 'rts-db-migration',
  templateUrl: './db-migration.component.html',
  imports: [
    TabsModule,
    RouterOutlet,
    RouterLink
  ]
})
export class DbMigrationComponent extends AutoStretchComponent {}
