import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormField, form, min, pattern, required, submit, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import {
  Booking,
  type BedType,
  type BookingRequest,
  type Direction,
  type PreferredFloor,
  type PreferredPosition,
} from '../../services/booking';

@Component({
  selector: 'app-booking-form',
  imports: [FormField, RouterLink],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.scss',
})
export class BookingForm {
  private readonly bookingService = inject(Booking);
  private readonly blockedDates = signal(new Set<string>());

  protected readonly bookingModel = signal<BookingRequest>({
    fullName: '',
    phone: '',
    pickupTime: '',
    direction: 'hanoi_to_son_la' as Direction,
    pickupLocation: '',
    dropoffLocation: '',
    bedType: 'single' as BedType,
    bedQuantity: 1,
    passengerCount: 1,
    preferredFloor: 'no_preference' as PreferredFloor,
    preferredPosition: 'no_preference' as PreferredPosition,
    note: '',
  });

  protected readonly bookingForm = form(this.bookingModel, (field) => {
    required(field.fullName, { message: 'Vui lòng nhập họ tên' });
    required(field.phone, { message: 'Vui lòng nhập số điện thoại' });
    pattern(field.phone, /^(0|\+84)(3|5|7|8|9)\d{8}$/, {
      message: 'Số điện thoại không hợp lệ',
    });
    required(field.pickupTime, { message: 'Vui lòng chọn ngày giờ đi' });
    validate(field.pickupTime, ({ value }) => {
      if (!value()) return undefined;
      const minimumTime = Date.now() + 60 * 60 * 1000;
      return new Date(value()).getTime() < minimumTime
        ? { kind: 'minimumTime', message: 'Cần đặt trước giờ đi ít nhất 1 tiếng' }
        : undefined;
    });
    validate(field.pickupTime, ({ value }) => {
      const selectedDate = value().slice(0, 10);
      return selectedDate && this.blockedDates().has(selectedDate)
        ? { kind: 'blockedDate', message: 'Nhà xe nghỉ ngày này. Vui lòng chọn ngày khác.' }
        : undefined;
    });
    required(field.pickupLocation, { message: 'Vui lòng nhập điểm đón' });
    required(field.dropoffLocation, { message: 'Vui lòng nhập điểm trả' });
    min(field.bedQuantity, 1, { message: 'Số giường phải từ 1 trở lên' });
    min(field.passengerCount, 1, { message: 'Số hành khách phải từ 1 trở lên' });
  });

  protected readonly isSubmitting = signal(false);
  protected readonly successMessage = signal('');
  protected readonly errorMessage = signal('');
  constructor() {
    firstValueFrom(this.bookingService.getBlockedDates())
      .then((result) => this.blockedDates.set(new Set(result.dates.map((item) => item.date))))
      .catch(() => undefined);
  }
  protected onSubmit(): void {
    submit(this.bookingForm, async () => {
      this.isSubmitting.set(true);
      this.successMessage.set('');
      this.errorMessage.set('');

      try {
        const result = await firstValueFrom(this.bookingService.create(this.bookingModel()));
        this.successMessage.set(result.message);
      } catch (error) {
        const message =
          error instanceof HttpErrorResponse && error.error?.message
            ? error.error.message
            : 'Không thể gửi yêu cầu. Vui lòng thử lại.';
        this.errorMessage.set(message);
      } finally {
        this.isSubmitting.set(false);
      }
    });
  }
}
