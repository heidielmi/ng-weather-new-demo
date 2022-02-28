import { Injectable } from '@angular/core';
import { ICity } from '../models/location.model';
import { WeatherService } from "./weather.service";

export const LOCATIONS : string = "locations";

@Injectable({providedIn: 'root'})
export class LocationService {

  cities : ICity[] = [];

  constructor(private weatherService : WeatherService) {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString)
      this.cities = JSON.parse(locString);
    for (let city of this.cities)
      this.weatherService.addCurrentConditions(city);
  }

  addLocationToLocalStorage(countrycode: string, zip: string){
    let existingCity = this.cities.find((city) => city.countryCode === countrycode && city.zipCode === zip);
    if (!existingCity){
      this.cities.push({zipCode: zip, countryCode: countrycode});
      localStorage.setItem(LOCATIONS, JSON.stringify(this.cities));
    }
  }

  removeLocation(zipCode: string, countryCode: string){
    let existingCity = this.cities.find((city) => city.countryCode === countryCode && city.zipCode === zipCode);
    if (existingCity){
      this.cities = this.cities.filter((city) => city.countryCode !== countryCode && city.zipCode !== zipCode);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.cities));
      this.weatherService.removeCurrentConditions(existingCity);
    }
  }
}
