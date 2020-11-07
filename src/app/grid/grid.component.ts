import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {TimeSlot} from '../models/time-slot';
import {Observable} from 'rxjs';
import {AreaName} from '../models/area';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})
export class GridComponent implements OnInit {

  @Input() timeSlots$: Observable<TimeSlot[]>;
  public timeSlotsByDay$: Observable<Record<string, TimeSlot[]>>;

  constructor() {
  }

  ngOnInit(): void {
    this.timeSlotsByDay$ = this.timeSlots$.pipe(
      map(timeSlots => {
        const timeSlotsByDay = {};
        const uniqueTimeSlots: Record<string, boolean> = {};

        for (const slot of timeSlots) {
          const dateStr = slot.check_in_at.toLocaleDateString();
          timeSlotsByDay[dateStr] = [...(timeSlotsByDay[dateStr] ?? []), slot];

          const timeStr = slot.check_in_at.toLocaleTimeString();
          uniqueTimeSlots[timeStr] = true;
        }

        for (const day of Object.keys(timeSlotsByDay)) {
          for (const time of Object.keys(uniqueTimeSlots)) {
            const dayTimeSlots = timeSlotsByDay[day];
            const found = dayTimeSlots.find(slot => slot.check_in_at.toLocaleTimeString() === time);
            if (!found && dayTimeSlots.length > 0) { // Fill up missing slots
              dayTimeSlots.push({
                ...dayTimeSlots[0],
                free_spots: 0
              });
            }

          }
        }

        return timeSlotsByDay;
      })
    );
  }

}
