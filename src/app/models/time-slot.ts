import {AreaName} from './area';

interface TimeSlotBase {
  area: AreaName;
  booking_count: number;
  free_spots: number;
  spots_count: number;
}

export interface RawTimeSlot extends TimeSlotBase {
  check_in_at: string;
  created_at: string;
}

export interface TimeSlot extends TimeSlotBase {
  check_in_at: Date;
  created_at: Date;
}
