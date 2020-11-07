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

export interface DisabledTimeSlot {
  check_in_at: Date;
  disabled: true;
}

export type DisablableTimeSlot = TimeSlot | DisabledTimeSlot;

export function timeSlotIsDisabled(slot: DisablableTimeSlot): slot is DisabledTimeSlot {
  return (slot as any).disabled;
}

export function timeSlotIsEnabled(slot: DisablableTimeSlot): slot is TimeSlot {
  return !timeSlotIsDisabled(slot);
}

export interface TimeSlotsForDay {
  date: Date;
  timeSlots: DisablableTimeSlot[];
}
