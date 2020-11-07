import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AreaName} from '../models/area';
import {RawTimeSlot, TimeSlot} from '../models/time-slot';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  public getTimeSlots(area: AreaName): Observable<TimeSlot[]> {
    return this.http.get<RawTimeSlot[]>(`${environment.API_BASE}/${area}`).pipe(
      map(rawTimeSlots => rawTimeSlots.map(slot => ({
          ...slot,
          check_in_at: new Date(slot.check_in_at),
          created_at: new Date(slot.check_in_at),
        }))
      )
    );
  }

}
