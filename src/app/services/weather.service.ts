import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { IWeatherCondition } from '../models/weather-condition.model';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../store/app.state';
import { AddCity, RemoveCity } from '../store/city.actions';
import { ICity } from '../models/location.model';
@Injectable({providedIn: 'root'})

export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions: IWeatherCondition[] = [];
  cityList: ICity[] = [];

  @Select(AppState.getCities) cityList$!: Observable<ICity[]>;

  constructor(private http: HttpClient, private store: Store) { 
     this.cityList$.subscribe((cityList$: ICity[]) => { 
      this.cityList = cityList$; 
    });
  }

  addCurrentConditions(selectedCity: ICity): void {
    // Here we make a request to get the curret conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    //this.http.get(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
   this.http.get(`${WeatherService.URL}/weather?q=${selectedCity.zipCode},${selectedCity.countryCode}&APPID=${WeatherService.APPID}`)
    .subscribe(data => {
        this.currentConditions.push({zip: selectedCity.zipCode, countryCode: selectedCity.countryCode, data: data}) 
        this.store.dispatch(new AddCity(selectedCity));
      });
  }

  removeCurrentConditions(selectedCity: ICity) {
    this.currentConditions = this.currentConditions.filter((condition) => condition.countryCode !== selectedCity.countryCode && condition.zip !== selectedCity.zipCode);
    this.store.dispatch(new RemoveCity(selectedCity));
  }

  getZipCodeConditionsWithProgress(countryCode: string, zipCode: string): Observable<any> {
   // Tracking and showing request progress
   // in real project better to avoid any type and have proper data model
    const req = new HttpRequest('GET', `${WeatherService.URL}/weather?q=${zipCode},${countryCode}&APPID=${WeatherService.APPID}`, '', {
      reportProgress: true
    });
    return this.http.request(req);
  }

  addConditionToList(countryCode: string, zipCode: string, data: any){
    const newWeathercondition: IWeatherCondition = {
        zip: zipCode,
        countryCode: countryCode,
        data: data
    };
    this.currentConditions.push(newWeathercondition);
    // keep track of all the searched zipcodes in the store
    this.store.dispatch(new AddCity({
      zipCode: zipCode,
      countryCode: countryCode
      }));
  }

  getZipCodeConditions(countryCode: string, zipCode: string): Observable<IWeatherCondition> {
    // get the weathercondition related to a zipcode as an observable 
    //return this.http.get(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`).pipe(
      return this.http.get(`${WeatherService.URL}/weather?q=${zipCode},${countryCode}&APPID=${WeatherService.APPID}`).pipe(
      map((apiRes$) => {
        return this.transformToWeatherCondition(countryCode, zipCode, apiRes$);
      }),
      catchError((err$) => {
          throw err$;
      })
    );
  }

  getRefreshedConditionsForAllZipCodes(): Observable<IWeatherCondition[]> {
    let zipCodesConditionsList$: Observable<IWeatherCondition>[] = [];
    // loop through all avaialble zipcodes and make a request to get the current conditions data from the API for each of them 
    zipCodesConditionsList$ = this.cityList.map(city => this.getZipCodeConditions(city.countryCode, city.zipCode));
    // and finally merge all the observables
    return combineLatest([...zipCodesConditionsList$]).pipe(
        tap((data) => {
          return data;
        }));
  }
  
  getCurrentConditions(): any[] {
    return this.currentConditions;
  }

  getForecast(zipCode: string, countryCode: string): Observable<any> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    // return this.http.get(`${WeatherService.URL}/forecast/daily?zip=${zipCode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);
    return this.http.get(`${WeatherService.URL}/forecast/daily?zip=${zipCode},${countryCode}&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);

  }

  getWeatherIcon(id: number){
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

  private transformToWeatherCondition(countryCode: string, zipCode: string, apiRes$: any): IWeatherCondition {
    return {
      zip: zipCode,
      countryCode: countryCode,
      data: apiRes$
    };
  }

}
