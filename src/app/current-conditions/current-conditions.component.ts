import {Component, inject, Signal} from '@angular/core';
import {WeatherService} from '../weather.service';
import {LocationService} from '../location.service';
import {ConditionsAndZip} from '../conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  // here I expect index, but it can be some identifier as well, then we should add new input with identifier name,
  // or TabsComponent generic type should extends from some BaseType with identifier and ConditionsAndZip should extends from it as well
  remove(index: number): void {
    this.locationService.removeLocation(this.currentConditionsByZip()[index].zip);
  }

  headerFunction = location => `${location.data.name} (${location.zip})`;
}
