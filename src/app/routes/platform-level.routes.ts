import {Routes} from '@angular/router'
import {DbMigrationComponent} from '../../lib/components/platform-level/db-migration/db-migration.component'
import {
  MigrationHistoryComponent
} from '../../lib/components/platform-level/db-migration/migration-history/migration-history.component'
import {
  RunMigrationComponent
} from '../../lib/components/platform-level/db-migration/run-migration/run-migration.component'
import {DbVersionComponent} from '../../lib/components/platform-level/db-version/db-version.component'
import {OrganizationComponent} from '../../lib/components/platform-level/organization/organization.component'
import {TableRegistryComponent} from '../../lib/components/platform-level/table-registry/table-registry.component'

const dbMigrationsRoutes: Routes = [
  {path: 'history', component: MigrationHistoryComponent},
  {path: 'run', component: RunMigrationComponent},
  {path: '', redirectTo: 'history', pathMatch: 'full'}
]

export const platformManagementRoutes: Routes = [
  {path: 'organizations', component: OrganizationComponent},
  {path: 'db-versions', component: DbVersionComponent},
  {path: 'table-registry', component: TableRegistryComponent},
  {
    path: 'db-migrations',
    component: DbMigrationComponent,
    children: dbMigrationsRoutes
  },
  {path: '', redirectTo: 'organizations', pathMatch: 'full'}
]
