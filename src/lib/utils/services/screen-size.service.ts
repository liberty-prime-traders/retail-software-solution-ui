import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {inject, Injectable} from '@angular/core'
import {map} from 'rxjs'

@Injectable({providedIn: 'root'})
export class ScreenSizeService {
    private readonly breakpointObserver = inject(BreakpointObserver)

    readonly isMobilePortrait$ = this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
        map(breakPointState => breakPointState.matches)
    )

    readonly isMobileLandScape$ = this.breakpointObserver.observe(Breakpoints.HandsetLandscape).pipe(
        map(breakPointState => breakPointState.matches)
    )

    readonly isTabletPortrait$ = this.breakpointObserver.observe(Breakpoints.TabletPortrait).pipe(
        map(breakPointState => breakPointState.matches)
    )

    readonly isTabletLandscape$ = this.breakpointObserver.observe(Breakpoints.TabletLandscape).pipe(
        map(breakPointState => breakPointState.matches)
    )

    readonly isWebPortrait$ = this.breakpointObserver.observe(Breakpoints.WebPortrait).pipe(
        map(breakPointState => breakPointState.matches)
    )

    readonly isWebLandscape$ = this.breakpointObserver.observe(Breakpoints.WebLandscape).pipe(
        map(breakPointState => breakPointState.matches)
    )
}
