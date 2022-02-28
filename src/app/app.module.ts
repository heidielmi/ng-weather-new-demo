import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CurrentConditionsComponent } from './components/current-conditions/current-conditions.component';
import { ForecastsListComponent } from './components/forecasts-list/forecasts-list.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ZipcodeEntryComponent } from './components/zipcode-entry/zipcode-entry.component';
import { SharedModule } from './shared/shared.module';
import { AppState } from './store/app.state';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    CurrentConditionsComponent,
    ForecastsListComponent,
    MainPageComponent,
    ZipcodeEntryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    NgxsModule.forRoot([AppState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
