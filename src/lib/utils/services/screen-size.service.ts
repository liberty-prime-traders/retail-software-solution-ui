import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout'
import {inject, Injectable} from '@angular/core'
import {map, Observable} from 'rxjs'

@Injectable({providedIn: 'root'})
export class ScreenSizeService {
	private readonly breakpointObserver = inject(BreakpointObserver)
	
	readonly isMobilePortrait$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
		map(breakPointState => breakPointState.matches)
	);
	
	readonly isMobileLandScape$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetLandscape).pipe(
		map(breakPointState => breakPointState.matches)
	);
	
	readonly isTabletPortrait$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.TabletPortrait).pipe(
		map(breakPointState => breakPointState.matches)
	);
	
	readonly isTabletLandscape$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.TabletLandscape).pipe(
		map(breakPointState => breakPointState.matches)
	);
	
	readonly isWebPortrait$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.WebPortrait).pipe(
		map(breakPointState => breakPointState.matches)
	);
	
	readonly isWebLandscape$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.WebLandscape).pipe(
		map(breakPointState => breakPointState.matches)
	);
}
