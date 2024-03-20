import {Injectable, OnDestroy, Signal, signal} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import {HttpClient, HttpContext} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {LocationService} from './location.service';
import {CACHEABLE} from './cache.interceptor';

@Injectable()
export class WeatherService {

  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);

  constructor(private http: HttpClient, private locationService: LocationService) {
    locationService.getCurrentLocations().subscribe(zipcodes => this.updateCurrentConditions(zipcodes));
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`);

    // we can pass context with value false to make that this url will not be cached
    // return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`,
    //     { context: new HttpContext().set(CACHEABLE, false) });
  }

  getWeatherIcon(id): string {
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

  private updateCurrentConditions(zipcodes: string[]): void {
    this.removeOldConditions(zipcodes);
    this.addNewConditions(zipcodes);
  }

  private addNewConditions(zipcodes: string[]): void {
    const currentConditionsCodes = this.currentConditions().map(value => value.zip);
    const newZipCodes = zipcodes.filter(code => !currentConditionsCodes.includes(code));
    newZipCodes.forEach(code => this.addNewCondition(code));
  }

  private addNewCondition(zipcode: string): void {
    // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
    this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
        .subscribe(
            data => this.currentConditions.update(conditions => [...conditions, {zip: zipcode, data}]),
            error => {
                alert(`Incorrect zipcode: ${zipcode}`);
                this.locationService.removeLocation(zipcode);
            });
  }

  private removeOldConditions(zipcodes: string[]) {
    this.currentConditions.update(conditions => conditions.filter(c => zipcodes.includes(c.zip)));
  }

}
