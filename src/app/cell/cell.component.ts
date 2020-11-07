import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {DisablableTimeSlot, timeSlotIsDisabled, timeSlotIsEnabled} from '../models/time-slot';

declare var d3: any;

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.less']
})
export class CellComponent implements OnInit {
  isEnabled = timeSlotIsEnabled;
  isDisabled = timeSlotIsDisabled;

  @Input() timeSlot: DisablableTimeSlot;

  @HostBinding('style.color') get color() {
    if (this.isDisabled(this.timeSlot)) {
      return '#000';
    }

    const color = d3.interpolateGnBu(this.getProgress());
    const rgb = color.replace(/[^\d,]/g, '').split(',');
    const Y = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    return Y > 128 ? 'black' : 'white';
  }

  @HostBinding('style.background-color') get backgroundColor() {
    if (this.isDisabled(this.timeSlot)) {
      return '#00000044';
    }

    const progress = this.getProgress();
    return progress === 1 ? 'black' : d3.interpolateGnBu(progress);
  }

  private getProgress(): number {
    if (!this.isEnabled(this.timeSlot)) {
      return 1;
    }

    return (this.timeSlot.capacity - this.timeSlot.free_spots) / this.timeSlot.capacity;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
