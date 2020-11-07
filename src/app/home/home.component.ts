import {Component} from '@angular/core';
import {ApiService} from '../services/api.service';
import {AreaName} from '../models/area';
import {TimeSlot} from '../models/time-slot';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {

  public sport$: Observable<TimeSlot[]>;
  public boulder$: Observable<TimeSlot[]>;
  public outside$: Observable<TimeSlot[]>;

  constructor(private api: ApiService) {
    this.sport$ = api.getTimeSlots(AreaName.SPORT);
    this.boulder$ = api.getTimeSlots(AreaName.BOULDER);
    this.outside$ = api.getTimeSlots(AreaName.OUTSIDE);
  }

}
