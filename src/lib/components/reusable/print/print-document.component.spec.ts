import {Component, signal} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {PRINT_DIRECTIVES} from './print-directives'
import {PrintDocumentComponent} from './print-document.component'
import {PrintPaperPreset} from './print-layout.model'
import {createPresetPrintLayout} from './print-layout.util'

@Component({
  imports: [PrintDocumentComponent, ...PRINT_DIRECTIVES],
  template: `
    <rts-print-document [layout]="layout()">
      @if (withHeader()) {
        <ng-template rtsPrintHeader><span id="header">Header</span></ng-template>
      }
      <p id="body">Body</p>
      <p id="hide" rtsPrintHide>Hidden</p>
      <p id="only" rtsPrintOnly>Only</p>
      <p id="keep" rtsPrintKeepTogether>Keep</p>
      <p id="break" rtsPrintBreakBefore>Break</p>
      <ng-template rtsPrintFooter><span id="footer">Footer</span></ng-template>
    </rts-print-document>
  `
})
class HostComponent {
  readonly layout = signal(createPresetPrintLayout(PrintPaperPreset.A4))
  readonly withHeader = signal(true)
}

describe('PrintDocumentComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>
  let root: HTMLElement
  const query = (selector: string) => root.querySelector(selector)

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent)
    root = fixture.nativeElement
    fixture.detectChanges()
  })

  it('projects arbitrary content and renders header and footer templates around it', () => {
    expect(query('.rts-print-doc__header #header')).not.toBeNull()
    expect(query('.rts-print-doc__body #body')).not.toBeNull()
    expect(query('.rts-print-doc__footer #footer')).not.toBeNull()
  })

  it('works without a header template', () => {
    fixture.componentInstance.withHeader.set(false)
    fixture.detectChanges()
    expect(query('.rts-print-doc__header')).toBeNull()
    expect(query('#body')).not.toBeNull()
  })

  it('marks elements through the directives', () => {
    expect(query('#hide')?.classList).toContain('rts-print-hide')
    expect(query('#only')?.classList).toContain('rts-print-only')
    expect(query('#keep')?.classList).toContain('rts-print-keep-together')
    expect(query('#break')?.classList).toContain('rts-print-break-before')
  })

  it('exposes layout variables and kind classes', () => {
    const doc = query('rts-print-document') as HTMLElement
    expect(doc.classList).toContain('rts-print-doc--paged')
    expect(doc.style.getPropertyValue('--rts-print-width')).toBe('210mm')

    fixture.componentInstance.layout.set(createPresetPrintLayout(PrintPaperPreset.RECEIPT_58MM))
    fixture.detectChanges()
    expect(doc.classList).toContain('rts-print-doc--receipt')
    expect(doc.style.getPropertyValue('--rts-print-width')).toBe('58mm')
    expect(doc.style.getPropertyValue('--rts-print-printable-width')).toBe('48mm')
  })

  it('applies hide/only/break semantics through the shipped stylesheet', () => {
    document.body.appendChild(root)
    try {
      expect(getComputedStyle(query('#only')!).display).not.toBe('none')
      expect(getComputedStyle(query('#break')!).breakBefore).toBe('page')

      fixture.componentInstance.layout.set(createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM))
      fixture.detectChanges()
      expect(getComputedStyle(query('#break')!).breakBefore).not.toBe('page')
    } finally {
      root.remove()
    }
  })

  it('hides rtsPrintOnly outside of a document surface', () => {
    const stray = document.createElement('p')
    stray.className = 'rts-print-only'
    document.body.appendChild(stray)
    try {
      expect(getComputedStyle(stray).display).toBe('none')
    } finally {
      stray.remove()
    }
  })
})
