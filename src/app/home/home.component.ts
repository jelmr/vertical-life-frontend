import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ApiService} from '../services/api.service';
import {AreaName} from '../models/area';
import {TimeSlot} from '../models/time-slot';
import {BehaviorSubject, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  public AREAS = [AreaName.SPORT, AreaName.BOULDER, AreaName.OUTSIDE];
  public selectedArea$ = new BehaviorSubject(AreaName.SPORT);

  public timeSlots$: Observable<TimeSlot[]>;

  constructor(private api: ApiService) {
    this.timeSlots$ = this.selectedArea$.pipe(
      switchMap(area => api.getTimeSlots$(area))
    );
  }

}
