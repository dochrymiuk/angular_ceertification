import { Component } from '@angular/core';
import {LocationService} from "../location.service";

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private service : LocationService) { }

  addLocation(zipcode: HTMLInputElement) {
    this.service.addLocation(zipcode.value);
    zipcode.value = null;
  }

}
