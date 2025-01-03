import {AsyncPipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {delay, filter, Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {Organization} from '../../../../api/organization/organization.model'
import {OrganizationService} from '../../../../api/organization/organization.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {OrganizationFormComponent} from './organization-form/organization-form.component'

@Component({
    standalone: true,
    selector: 'rts-organization',
    templateUrl: 'organization.component.html',
    imports: [
        TableModule,
        AsyncPipe,
        NullishToZeroPipe,
        NullSafePipe,
        Button,
        OrganizationFormComponent,
        AddRowComponent
    ]
})
export class OrganizationComponent extends HasSubscriptionComponent implements OnInit {
    private readonly organizationService = inject(OrganizationService)
    readonly loading$ = this.organizationService.selectLoading$()
    readonly processingIsUnderWay$ = this.organizationService.processingIsUnderWay$()
    readonly organizations$ = this.organizationService.selectAll$()
    selectedOrganization = model<Organization|undefined>(undefined)

    readonly addingIsActive = signal(false)
    readonly rowIsExpanded = signal<boolean>(false)

    ngOnInit() {
        this.organizationService.fetch()
        this.subscriptions.add(this.listenToOrganizationSaveStatus())
    }

    private listenToOrganizationSaveStatus(): Subscription {
        return this.organizationService.processingStatus$().pipe(
            filter(status => status === ProcessingStatus.SUCCESS),
            delay(500),
            tap(() => this.addingIsActive.set(false))
        )
            .subscribe()
    }
}
