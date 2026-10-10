import {DOCUMENT} from '@angular/common'
import {Injectable} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {PrintPaperPreset} from './print-layout.model'
import {createPresetPrintLayout} from './print-layout.util'
import {PrintError, PrintFailureReason, PrintService} from './print.service'

@Injectable()
class StubbedPrintService extends PrintService {
  opened = 0
  inspect?: (frameWindow: Window) => void

  protected override openPrintDialog(frameWindow: Window) {
    this.opened++
    this.inspect?.(frameWindow)
    frameWindow.dispatchEvent(new Event('afterprint'))
  }
}

describe('PrintService', () => {
  const layout = createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM)
  let surface: HTMLElement

  beforeEach(() => {
    surface = document.createElement('div')
    surface.className = 'rts-print-doc'
    surface.textContent = 'Hello receipt'
  })

  describe('with a browser', () => {
    let service: StubbedPrintService

    beforeEach(() => {
      TestBed.configureTestingModule({providers: [{provide: PrintService, useClass: StubbedPrintService}]})
      service = TestBed.inject(PrintService) as StubbedPrintService
    })

    it('prints only the surface in an isolated frame with a literal @page rule, then cleans up', async () => {
      let pageRule = ''
      let bodyText = ''
      service.inspect = win => {
        pageRule = win.document.getElementById('rts-print-page-style')?.textContent ?? ''
        bodyText = win.document.body.textContent ?? ''
      }

      await service.print(surface, layout)

      expect(pageRule).toMatch(/size: 80mm \d+(\.\d+)?mm;/)
      expect(pageRule).not.toContain('auto')
      expect(pageRule).toContain('margin: 0')
      expect(bodyText).toBe('Hello receipt')
      expect(document.querySelector('iframe[data-rts-print-frame]')).toBeNull()
      expect(service.isPrinting()).toBeFalse()
    })

    it('reuses the open job when called again', async () => {
      const first = service.print(surface, layout)
      const second = service.print(surface, layout)
      expect(service.isPrinting()).toBeTrue()
      expect(second).toBe(first)
      await first
      expect(service.opened).toBe(1)
    })

    it('can print again after a job finished', async () => {
      await service.print(surface, layout)
      await service.print(surface, layout)
      expect(service.opened).toBe(2)
    })

    it('rejects an invalid layout and does not leave a frame behind', async () => {
      const invalid = {...layout, width: {...layout.width, value: -1}}
      await expectAsync(service.print(surface, invalid)).toBeRejected()
      expect(document.querySelector('iframe[data-rts-print-frame]')).toBeNull()
    })
  })

  describe('without a browser window', () => {
    it('rejects as unsupported', async () => {
      TestBed.configureTestingModule({providers: [{provide: DOCUMENT, useValue: {defaultView: null}}]})
      const service = TestBed.inject(PrintService)

      expect(service.isSupported).toBeFalse()
      const error = await service.print(surface, layout).catch(e => e)
      expect(error).toBeInstanceOf(PrintError)
      expect(error.reason).toBe(PrintFailureReason.UNSUPPORTED)
    })
  })
})
