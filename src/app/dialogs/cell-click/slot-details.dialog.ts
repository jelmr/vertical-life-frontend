import {Component} from '@angular/core';
import {TimeSlot} from '../../models/time-slot';

@Component({
  selector: 'app-slot-details',
  styleUrls: ['slot-details.dialog.less'],
  templateUrl: 'slot-details.dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class SlotDetailsDialog {

  public timeSlot: TimeSlot;

}
