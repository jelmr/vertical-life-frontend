import {ChangeDetectionStrategy, Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {DisablableTimeSlot, timeSlotIsDisabled, timeSlotIsEnabled} from '../models/time-slot';
import {MatDialog} from '@angular/material/dialog';
import {SlotDetailsDialog} from '../dialogs/cell-click/slot-details.dialog';

declare var d3: any;

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent implements OnInit {
  isEnabled = timeSlotIsEnabled;
  isDisabled = timeSlotIsDisabled;

  @Input() timeSlot: DisablableTimeSlot;

  constructor(private dialog: MatDialog) {
  }


  @HostListener('click')
  private onClick(){
    if (this.isEnabled(this.timeSlot)) {
      const dialogRef = this.dialog.open(SlotDetailsDialog);
      dialogRef.componentInstance.timeSlot = this.timeSlot;
    }
  }

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

  ngOnInit(): void {
  }

}
