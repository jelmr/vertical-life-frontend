import {Component, Input, OnInit} from '@angular/core';
import {TimeSlot, TimeSlotsForDay} from '../models/time-slot';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {KeyValue} from '@angular/common';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less']
})
export class GridComponent implements OnInit {

  @Input() timeSlots$: Observable<TimeSlot[]>;
  public timeSlotsByDay$: Observable<TimeSlotsForDay[]>;


  constructor() {
  }

  sortByDate(a: KeyValue<string, unknown>, b: KeyValue<string, unknown>) {
    // @ts-ignore
    return new Date(a.key) - new Date(b.key);
  }

  ngOnInit(): void {
    this.timeSlotsByDay$ = this.timeSlots$.pipe(
      map(timeSlots => {
        const timeSlotsByDay = {};
        const uniqueTimeSlots = {};

        for (const slot of timeSlots) {
          const dateStr = slot.check_in_at.toLocaleDateString();
          timeSlotsByDay[dateStr] = [...(timeSlotsByDay[dateStr] ?? []), slot];
          const timeStr = slot.check_in_at.toLocaleTimeString();
          uniqueTimeSlots[timeStr] = slot;
        }

        // Fill missing slots
        for (const day of Object.keys(timeSlotsByDay)) {
          const dayTimeSlots = timeSlotsByDay[day];
          for (const time of Object.keys(uniqueTimeSlots)) {
            const found = dayTimeSlots.find(slot => slot.check_in_at.toLocaleTimeString() === time);
            if (!found && dayTimeSlots.length > 0) {
              dayTimeSlots.push({
                check_in_at: uniqueTimeSlots[time].check_in_at,
                disabled: true
              });
            }
          }

          // Sort the time slots in each array
          timeSlotsByDay[day] = dayTimeSlots.sort((a, b) => a.check_in_at - b.check_in_at);
        }

        return Object.entries(timeSlotsByDay).map(([key, value]) => ({
          date: new Date(key),
          timeSlots: value as TimeSlot[]
        })).sort((a, b) => a.date.getTime() - b.date.getTime());
      })
    );
  }

}
