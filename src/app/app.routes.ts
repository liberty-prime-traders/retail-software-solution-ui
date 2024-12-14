import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {PublicComponent} from '../lib/components/public/public.component'

const secureRoutes: Routes = [
]

const appChildRoutes: Routes = [
    {path: 'login/callback', component: OktaCallbackComponent},
    {path: 'secure', canActivate: [OktaAuthGuard], loadChildren: () => secureRoutes},
    {path: '', component: PublicComponent}
]

export const appRoutes: Routes = [
    {
        path: '',
        children: appChildRoutes
    },
    {path: '**', redirectTo: ''}
];
