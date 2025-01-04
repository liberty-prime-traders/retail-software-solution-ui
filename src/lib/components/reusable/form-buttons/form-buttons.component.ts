import {Component, computed, input, model, output, signal} from '@angular/core'
import {ConfirmationService} from 'primeng/api'
import {ButtonModule} from 'primeng/button'
import {ConfirmDialogModule} from 'primeng/confirmdialog'
import {ProgressSpinner} from 'primeng/progressspinner'
import {Tag} from 'primeng/tag'
import {FormAction} from '../../../utils/types/form-action.enum'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {TooltipComponent} from '../tooltip/tooltip.component'

@Component({
    selector: 'rts-forms-buttons',
    templateUrl: 'form-buttons.component.html',
    providers: [ConfirmationService],
    standalone: true,
    imports: [
        ButtonModule,
        ConfirmDialogModule,
        ProgressSpinner,
        Tag,
        TooltipComponent
    ]
})
export class FormButtonsComponent {
    readonly save = output()
    readonly delete = output()
    readonly cancel = output()

    readonly hideDelete = input(false)
    readonly hideCancel = input(false)
    readonly hideSave = input(false)

    readonly disableDelete = input(false)
    readonly disableCancel = input(false)
    readonly disableSave = input(false)
    readonly cancelLabel = input('Cancel')

    readonly processingStatus = model<ProcessingStatus|undefined|null>(ProcessingStatus.IDLE)
    readonly deleteInProgressMessage = input('Deleting...')
    readonly saveInProgressMessage = input('Saving...')
    readonly successMessage = input('Success')
    readonly failureMessages = input<string[] | undefined | null>()

    readonly ProcessingStatus = ProcessingStatus
    readonly deleteWarning = 'Are you sure you want to delete this record?'
    readonly deleteLabel = 'Delete'
    readonly saveLabel = 'Save'

    readonly processingIsUnderway = computed(() => this.processingStatus() === ProcessingStatus.IN_PROGRESS)
    readonly latestFormAction = signal<FormAction|undefined>(undefined)
    readonly deleteIsActive = signal(false)

    readonly inProgressMessage = computed(() =>
        this.latestFormAction() === FormAction.DELETE ? this.deleteInProgressMessage() : this.saveInProgressMessage()
    )

    confirmCancel() {
        this.cancel.emit()
    }

    confirmSave() {
        this.processingStatus.set(ProcessingStatus.IDLE)
        this.latestFormAction.set(FormAction.SAVE)
        this.save.emit()
    }

    confirmDelete() {
        this.processingStatus.set(ProcessingStatus.IDLE)
        this.latestFormAction.set(FormAction.DELETE)
        this.delete.emit()
        this.deleteIsActive.set(false)
    }
}
