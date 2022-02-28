import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css']
})
export class ForecastsListComponent implements OnInit {

  zipcode!: string | null;
  countryCode!: string | null;
  forecast: any;

  constructor(private weatherService: WeatherService, route : ActivatedRoute) {
    route.paramMap.subscribe(params => {
      this.zipcode = params.get('zipcode');
      this.countryCode = params.get('countryCode');
      if (this.zipcode && this.countryCode) {
        weatherService.getForecast(this.zipcode, this.countryCode)
        .subscribe((data: any) => {
          this.forecast = data
        });
      }
    });
  }
  ngOnInit(): void {
  }
  getWeatherIcon(id: number) {
    return this.weatherService.getWeatherIcon(id);
  }

}
