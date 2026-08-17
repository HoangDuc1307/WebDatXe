import { Component } from '@angular/core';
import { BookingForm } from './features/booking-form/booking-form';

@Component({
  selector: 'app-root',
  imports: [BookingForm],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
