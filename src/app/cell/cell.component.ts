import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {TimeSlot} from '../models/time-slot';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.less']
})
export class CellComponent implements OnInit {

  @Input() timeSlot: TimeSlot;

  @HostBinding('style.background-color') get backgroundColor() {
    return `hsl(29, 100%, ${this.timeSlot.free_spots / 30 * 75 + 25}%)`;

  }

  constructor() {
  }

  ngOnInit(): void {
  }

}
