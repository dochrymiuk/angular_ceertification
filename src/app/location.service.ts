import {Injectable, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {

  private locations = signal<string[]>([]);

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations.set(JSON.parse(locString));
    }
  }

  // we can emit add event and remove event, but in this case I emit full list
  getCurrentLocations(): Observable<string[]> {
    return toObservable(this.locations);
  }

  addLocation(zipcode : string) {
    this.locations.update(locations => locations.includes(zipcode) ? locations : [...locations, zipcode]);
    this.updateLocationsInStorage();
  }

  removeLocation(zipcode : string) {
    this.locations.update(locations => locations.filter(l => l !== zipcode));
    this.updateLocationsInStorage();
  }

  private updateLocationsInStorage(): void {
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
  }
}
