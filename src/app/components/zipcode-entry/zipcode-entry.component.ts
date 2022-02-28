import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, last, tap } from 'rxjs/operators';
import { IWeatherCondition } from '../../models/weather-condition.model';
import { LocationService } from '../../services/location.service';
import { WeatherService } from '../../services/weather.service';
import { environment } from '../../../environments/environment';
import { HttpStateEnum } from '../../models/http-state.model';
import { ICountry } from '../../models/location.model';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  styleUrls: ['./zipcode-entry.component.css']
})
export class ZipcodeEntryComponent {
  httpReqState: HttpStateEnum = HttpStateEnum.default;
  selectedCountryExists = false;
  btnText = "";
  zipCode = "";
  private countrySearch$ = new Subject<string>();
  countrySugessionBoxDisplayed = true;
  countryList: ICountry[]= [] ;
  selectedCountry!: ICountry | null;
  originalCountryList: ICountry[] = [
    {
      countryName: "Switzerland",
      countryCode: "CH"
    },
    {
      countryName: "France",
      countryCode: "FR"
    },
    {
      countryName: "Germany",
      countryCode: "DE"
    },
    {
      countryName: "Japan",
      countryCode: "JP"
    },
    {
      countryName: "Australia",
      countryCode: "AU"
    },
    {
      countryName: "USA",
      countryCode: "US"
    },
  ];
  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.countryList = this.originalCountryList;
    this.btnText = environment.defaultText;
    if (this.btnText === '') {
      this.btnText = 'Save';
    }
    
    // STEP #3 - Add a country selection component with auto-filtering
    // I have created a pipe(boldMatchingSectionPipe) in shared module to transform the matching part to bold
    this.countrySearch$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((countryStr) => {
          countryStr = countryStr.toLowerCase();
          // I have used a limited country-list(hard coded) for the demo purposes
          this.countryList = this.originalCountryList.filter(
            (country) => country.countryName.toLowerCase().indexOf(countryStr) !== -1
          );
          this.selectedCountryExists = false;
        })
        // switchMap((location) => {
        // alternatively some API can be called to return matching cities
        //   return this.someService.getMatchingCities(location);
        // })
      )
      .subscribe();

  }
  // STEP #2
  // Create a button that supports three different states: Default - Working - Done
  // please refer to stateful-button (dumb component) in shared module
  // I have done this step with two approches:
  // approach-1: using HttpClient Tracking and showing request progress
  // approach-2: Please refer to addLocation method
  addLocationUsingHttpShowProgress(zipCode: string) {
    let countryCode = "";
    if (this.selectedCountry) {
      countryCode = this.selectedCountry.countryCode;
    }
    this.weatherService.getZipCodeConditionsWithProgress(countryCode, zipCode)
    .pipe(
      tap((event) => this.getEventMessage(event)),
      last() // return last (completed) message to caller
    )
    .subscribe((res) => {
       // sticking to the existing logic of this app
       this.weatherService.addConditionToList(countryCode, zipCode, res.body);
       // sticking to the existing logic of this app
       // add the searched zipcode to local storage
       this.locationService.addLocationToLocalStorage(countryCode, zipCode);
      // reset button to its initial state after 500 milliseconds
      setTimeout(() => {
        // The button should also be reset to its initial state after 500 milliseconds
        this.httpReqState = HttpStateEnum.default;
        this.btnText = environment.defaultText;
        if (this.btnText === '') {
          this.btnText = 'Save';
        }
      }, 500);
    });
  }
  /** Return http-state for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        // this code practice just shows three states(dflt, inprogress and completed)
        this.httpReqState = HttpStateEnum.default;
        break;

      case HttpEventType.Response:
        this.httpReqState = HttpStateEnum.completed;
        this.btnText = environment.completedText;
        if (this.btnText === '') {
          this.btnText = 'Saved';
        }
        break;

      default:
        this.httpReqState = HttpStateEnum.inprogress;
        if (environment.inProgressText) {
          this.btnText = 'Saving...';
        }
    }
  }
  // approach-2: simpler approach
  addLocation(zipcode: string) {
    this.btnText = environment.inProgressText;
    if (this.btnText === '') {
      this.btnText = 'Saving...';
    }
    this.httpReqState = HttpStateEnum.inprogress;
    let countryCode = "";
    if (this.selectedCountry) {
      countryCode = this.selectedCountry.countryCode;
    }
    this.weatherService
      .getZipCodeConditions(countryCode, zipcode)
      .subscribe((res$: IWeatherCondition) => {
        this.httpReqState = HttpStateEnum.completed;
        this.btnText = environment.completedText;
        if (this.btnText === '') {
          this.btnText = 'Saved';
        }
        this.weatherService.addConditionToList(countryCode, zipcode, res$.data);
        // add to local storage
        this.locationService.addLocationToLocalStorage(countryCode, zipcode);
        // reset button to its initial state after 500 milliseconds
        setTimeout(() => {
          this.httpReqState = HttpStateEnum.default;
          this.btnText = environment.defaultText;
          if (this.btnText === '') {
            this.btnText = 'Save';
          }
        }, 500);
      });
  }

  searchCountry(location: string) {
    this.countrySugessionBoxDisplayed = true;
    this.zipCode = "";
    this.countrySearch$.next(location);
  }

  selectCountry(selectedCountry: ICountry) {
    this.selectedCountry = selectedCountry;
    this.countrySugessionBoxDisplayed = false;
    this.selectedCountryExists = true;
  }


}
