import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastsListComponent } from './components/forecasts-list/forecasts-list.component';
import { MainPageComponent } from './components/main-page/main-page.component';

const appRoutes: Routes = [
  {
    path: '', component: MainPageComponent
  },
  {
    path: 'forecast/:zipcode/:countryCode', component: ForecastsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
