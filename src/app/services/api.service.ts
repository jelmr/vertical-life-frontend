import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AreaName} from '../models/area';
import {RawTimeSlot, TimeSlot} from '../models/time-slot';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private cache = {};

  constructor(private http: HttpClient) {
  }

  private _getTimeSlots$(area: AreaName): Observable<TimeSlot[]> {
    return this.http.get<RawTimeSlot[]>(`${environment.API_BASE}/${area}`).pipe(
      map(rawTimeSlots => rawTimeSlots.map(slot => ({
          ...slot,
          check_in_at: new Date(slot.check_in_at),
          created_at: new Date(slot.created_at),
        }))
      )
    );
  }


  public getTimeSlots$(area: AreaName): Observable<TimeSlot[]> {
    if (!(area in this.cache)) {
      this.cache[area] = this._getTimeSlots$(area).pipe(shareReplay(1));
    }

    return this.cache[area];
  }

}
