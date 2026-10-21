import {bootstrapApplication} from '@angular/platform-browser'
import {BarSeriesModule, CategoryAxisModule, LineSeriesModule, ModuleRegistry, NumberAxisModule} from 'ag-charts-community'
import {appConfig} from './app/app.config'
import {AppComponent} from './app/app.component'

ModuleRegistry.registerModules([BarSeriesModule, LineSeriesModule, CategoryAxisModule, NumberAxisModule])

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err))
