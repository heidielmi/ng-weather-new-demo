import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { interval, Observable, Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { Select } from "@ngxs/store";
import { LocationService }  from "../../services/location.service";
import { WeatherService }  from "../../services/weather.service";
import { ICity }  from "../../models/location.model";
import { AppState } from "../../store/app.state";
import { IWeatherCondition } from "../../models/weather-condition.model";
@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {

  intervalSubscription!: Subscription;
  zipCodeSubscription: Subscription;
  currentConditions: IWeatherCondition[] = [];
  @Select(AppState.getCities) cityList$!: Observable<ICity[]>;

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private router: Router
  ) {
    // read all searched zipcodes from store
    this.zipCodeSubscription = this.cityList$.subscribe((cityList: ICity[]) => {
      if (cityList.length > 0) {
        // existing logic of the app, to show weather conditions for all searched zipCodes upon initialization
        this.currentConditions = this.weatherService.getCurrentConditions();
      }
    });
  }

  ngOnInit() {
    // Step1: implement an auto-refresh of all weather conditions every 30 seconds
    this.intervalSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => {
        // make an api request for each searched zipcode and return the combined observable
          return this.weatherService.getRefreshedConditionsForAllZipCodes();
        })
      )
      .subscribe((weatherConditions$: IWeatherCondition[]) => {
        return (this.currentConditions = weatherConditions$);
      });
  }

  getCurrentConditions() {
    return this.weatherService.getCurrentConditions();
  }

  showForecast(weatherCondition: IWeatherCondition) {
    this.router.navigate([`/forecast/${weatherCondition.zip}/${weatherCondition.countryCode}`]);
  }

  removeLocation(weatherCondition: IWeatherCondition) {
    this.locationService.removeLocation(weatherCondition.zip, weatherCondition.countryCode);
  }
  
  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    if (this.zipCodeSubscription) {
      this.zipCodeSubscription.unsubscribe();
    }
  }
  getWeatherIcon(id: number) {
    return this.weatherService.getWeatherIcon(id);
  }
}
