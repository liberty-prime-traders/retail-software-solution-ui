import {DOCUMENT} from '@angular/common'
import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core'
import {PrintLayout, PrintLayoutKind} from './print-layout.model'
import {assertValidPrintLayout, buildPageRule, toCss} from './print-layout.util'

export enum PrintFailureReason {
  /** No browser DOM / print support (SSR, tests without a window, very old browsers). */
  UNSUPPORTED = 'UNSUPPORTED',
  /** The print frame could not be created or loaded. */
  FRAME_FAILED = 'FRAME_FAILED'
}

export class PrintError extends Error {
  constructor(readonly reason: PrintFailureReason, message: string) {
    super(message)
    this.name = 'PrintError'
  }
}

const MM_PER_CSS_PIXEL = 25.4 / 96
const FRAME_ATTRIBUTE = 'data-rts-print-frame'
const PAGE_STYLE_ID = 'rts-print-page-style'
const READY_TIMEOUT_MS = 15_000

/**
 * Native browser printing for a rendered `rts-print-document`.
 *
 * Approach: the rendered surface is copied into a hidden, same-origin iframe together with the application's
 * stylesheets, and only that iframe is printed. That gives:
 *  - isolation from app chrome, PrimeNG overlays, sidebars and scroll containers (they are simply not there);
 *  - a per-job literal `@page` rule, without touching the application's own page setup;
 *  - no popup windows, so nothing for a popup blocker to block.
 * The copy is a snapshot: it contains no listeners and triggers no component code, so printing cannot repeat
 * data fetching or side effects.
 *
 * Readiness is event-driven (stylesheet load, `document.fonts.ready`, image decode), never a fixed delay.
 */
@Injectable({providedIn: 'root'})
export class PrintService {
  private readonly document = inject(DOCUMENT)

  private readonly _activeJob = signal<Promise<void> | null>(null)
  private readonly _activeFrame = signal<HTMLIFrameElement | null>(null)

  readonly isPrinting = computed(() => this._activeJob() !== null)

  constructor() {
    inject(DestroyRef).onDestroy(() => this.removeFrame())
  }

  get isSupported(): boolean {
    const view = this.document.defaultView
    return typeof view?.print === 'function'
  }

  /**
   * Resolves once the browser's print dialog has been closed (printed or cancelled - browsers do not say which).
   * Calling it again while a job is open returns the same promise instead of stacking dialogs.
   * Rejects with `PrintError` when printing is unsupported or the frame fails, and with `PrintLayoutError` for an
   * invalid layout.
   */
  print(surface: HTMLElement, layout: PrintLayout): Promise<void> {
    const existing = this._activeJob()
    if (existing) {
      return existing
    }
    if (!this.isSupported) {
      return Promise.reject(new PrintError(PrintFailureReason.UNSUPPORTED, 'Printing is not supported in this environment.'))
    }
    try {
      assertValidPrintLayout(layout)
    } catch (error) {
      return Promise.reject(error)
    }

    const job = this.run(surface, layout).finally(() => {
      this.removeFrame()
      this._activeJob.set(null)
    })
    this._activeJob.set(job)
    return job
  }

  private async run(surface: HTMLElement, layout: PrintLayout): Promise<void> {
    const frame = await this.orTimeout(this.createFrame(layout), 'The print frame did not load in time.')
    const frameDocument = frame.contentDocument
    const frameWindow = frame.contentWindow
    if (!frameDocument || !frameWindow) {
      throw new PrintError(PrintFailureReason.FRAME_FAILED, 'The print frame is not available.')
    }

    this.copyApplicationStyles(frameDocument)
    const pageStyle = this.appendPageStyle(frameDocument, layout)
    const printedSurface = frameDocument.body.appendChild(frameDocument.importNode(surface, true)) as HTMLElement
    // The frame itself is a plain white canvas; the surface carries its own layout variables inline.
    frameDocument.documentElement.style.background = '#fff'
    frameDocument.body.style.cssText = 'margin:0;padding:0;background:#fff;'

    await this.orTimeout(this.whenReady(frameDocument), 'The print content did not load in time.')
    this.fitReceiptPageToContent(pageStyle, printedSurface, layout)

    await new Promise<void>(resolve => {
      const printMedia = frameWindow.matchMedia?.('print')
      const done = () => {
        frameWindow.removeEventListener('afterprint', done)
        printMedia?.removeEventListener?.('change', onMediaChange)
        resolve()
      }
      // Safari does not reliably fire afterprint for iframes; leaving the print media state is its signal.
      const onMediaChange = (event: MediaQueryListEvent) => {
        if (!event.matches) {
          done()
        }
      }
      frameWindow.addEventListener('afterprint', done)
      printMedia?.addEventListener?.('change', onMediaChange)

      this.openPrintDialog(frameWindow)
    })
  }

  /** A stylesheet or frame that never loads must not leave the service stuck in the printing state. */
  private async orTimeout<T>(work: Promise<T>, message: string): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new PrintError(PrintFailureReason.FRAME_FAILED, message)), READY_TIMEOUT_MS)
    })
    try {
      return await Promise.race([work, timeout])
    } finally {
      clearTimeout(timer)
    }
  }

  /** Separate method so tests can stand in for the blocking native dialog. */
  protected openPrintDialog(frameWindow: Window): void {
    frameWindow.focus()
    frameWindow.print()
  }

  private createFrame(layout: PrintLayout): Promise<HTMLIFrameElement> {
    this.removeFrame()
    return new Promise((resolve, reject) => {
      const frame = this.document.createElement('iframe')
      frame.setAttribute(FRAME_ATTRIBUTE, '')
      frame.setAttribute('aria-hidden', 'true')
      frame.tabIndex = -1
      // Off-screen but really laid out (display:none / 0x0 frames print blank in some browsers). Width matches
      // the paper so width-dependent CSS resolves the same way it will on paper.
      frame.style.cssText =
        `position:fixed;left:-10000px;top:0;border:0;width:${toCss(layout.width)};height:100vh;visibility:hidden;`
      frame.onload = () => resolve(frame)
      frame.onerror = () => reject(new PrintError(PrintFailureReason.FRAME_FAILED, 'The print frame failed to load.'))
      frame.srcdoc = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Print</title></head><body></body></html>'
      this._activeFrame.set(frame)
      this.document.body.appendChild(frame)
    })
  }

  private removeFrame(): void {
    this._activeFrame()?.remove()
    this._activeFrame.set(null)
  }

  /** Copies <style> and stylesheet <link> elements so component and global styles apply inside the frame. */
  private copyApplicationStyles(target: Document): void {
    const base = target.createElement('base')
    base.href = this.document.baseURI
    target.head.appendChild(base)

    this.document.head
      .querySelectorAll('style, link[rel~="stylesheet"]')
      .forEach(node => target.head.appendChild(target.importNode(node, true)))
  }

  private appendPageStyle(target: Document, layout: PrintLayout): HTMLStyleElement {
    const style = target.createElement('style')
    style.id = PAGE_STYLE_ID
    style.textContent = buildPageRule(layout)
    return target.head.appendChild(style)
  }

  /** Continuous roll: now that fonts and images are in, measure the real content and size the page to it. */
  private fitReceiptPageToContent(pageStyle: HTMLStyleElement, surface: HTMLElement, layout: PrintLayout): void {
    if (layout.kind !== PrintLayoutKind.RECEIPT) {
      return
    }
    const heightPx = surface.getBoundingClientRect().height
    if (heightPx > 0) {
      pageStyle.textContent = buildPageRule(layout, heightPx * MM_PER_CSS_PIXEL)
    }
  }

  private async whenReady(target: Document): Promise<void> {
    const stylesheets = Array.from(target.querySelectorAll<HTMLLinkElement>('link[rel~="stylesheet"]'))
      .filter(link => !link.sheet)
      .map(link => new Promise<void>(resolve => {
        link.addEventListener('load', () => resolve(), {once: true})
        link.addEventListener('error', () => resolve(), {once: true}) // a missing sheet must not block printing
      }))
    await Promise.all(stylesheets)

    // Fonts only start loading once something uses them, so force a layout before waiting on them.
    void target.body.offsetHeight

    const images = Array.from(target.images)
      .filter(image => !image.complete)
      .map(image => image.decode().catch(() => undefined))

    await Promise.all([target.fonts?.ready, ...images])
  }
}
