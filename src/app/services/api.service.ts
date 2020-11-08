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

  private static parseDate(dateStr: string): Date {
    const dateParser = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d*)?\+(\d{2}):(\d{2})/;
    const match = dateStr.match(dateParser);
    const date =  new Date(
      parseInt(match[1], 10),  // year
      parseInt(match[2], 10) - 1,  // monthIndex
      parseInt(match[3], 10),  // day
      parseInt(match[4], 10),  // hours
      parseInt(match[5], 10),  // minutes
      parseInt(match[6], 10)  // seconds
    );

    return new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust timezone
  }

  private _getTimeSlots$(area: AreaName): Observable<TimeSlot[]> {
    return this.http.get<RawTimeSlot[]>(`${environment.API_BASE}/${area}`).pipe(
      map(rawTimeSlots => rawTimeSlots.map(slot => ({
          ...slot,
          check_in_at: ApiService.parseDate(slot.check_in_at),
          created_at: ApiService.parseDate(slot.created_at),
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
