import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DisabledTimeSlot, TimeSlot, TimeSlotsForDay} from '../models/time-slot';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

  @Input() timeSlots$: Observable<TimeSlot[]>;
  public timeSlotsByDay$: Observable<TimeSlotsForDay[]>;
  public times$: Observable<Date[]>;


  constructor() {
  }

  trackByIndex = (index: number): number => {
    return index;
  }

  ngOnInit(): void {
    this.timeSlotsByDay$ = this.timeSlots$.pipe(
      map(timeSlots => {
        const timeSlotsByDay = {};
        const uniqueTimeSlots = {};

        const now = new Date();
        for (const slot of timeSlots) {
          if (slot.check_in_at < now) { // Disable slots that are in the past, data is inaccurate for them
            (slot as unknown as DisabledTimeSlot).disabled = true;
          }
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

        // Map to TimeSlotForDay[]
        return Object.entries(timeSlotsByDay).map(([key, value]) => ({
          date: new Date(key),
          timeSlots: value as TimeSlot[]
        })).sort((a, b) => a.date.getTime() - b.date.getTime());
      })
    );

    this.times$ = this.timeSlotsByDay$.pipe(
      map((timeSlotsByDay: TimeSlotsForDay[]) => {
        if (timeSlotsByDay.length === 0) {
          return [];
        }

        return timeSlotsByDay[0].timeSlots.map(slots => slots.check_in_at);
      })
    );
  }

}
