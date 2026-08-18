import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { environment } from '../../environments/environment';

export type Direction = 'hanoi_to_son_la' | 'son_la_to_hanoi';
export type BedType = 'single' | 'double';
export type PreferredFloor = 'no_preference' | 'floor_1' | 'floor_2';
export type PreferredPosition =
  | 'no_preference'
  | 'window'
  | 'near_door'
  | 'front'
  | 'middle'
  | 'back';

export interface BookingRequest {
  fullName: string;
  phone: string;
  pickupTime: string;
  direction: Direction;
  pickupLocation: string;
  dropoffLocation: string;
  bedType: BedType;
  bedQuantity: number;
  passengerCount: number;
  preferredFloor: PreferredFloor;
  preferredPosition: PreferredPosition;
  note: string;
}

interface BookingResponse {
  message: string;
  bookingId: string;
}

interface BlockedDatesResponse {
  dates: Array<{ date: string; reason: string }>;
}

@Service()
export class Booking {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/bookings`;

  create(booking: BookingRequest) {
    return this.http.post<BookingResponse>(this.apiUrl, {
      ...booking,
      pickupTime: new Date(booking.pickupTime).toISOString(),
    });
  }

  getBlockedDates() {
    return this.http.get<BlockedDatesResponse>(`${this.apiUrl}/blocked-dates`);
  }
}
