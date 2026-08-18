import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form, maxLength, required, submit, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Admin, type BlockedDate } from '../../services/admin';

@Component({ selector: 'app-admin-dashboard', imports: [DatePipe, FormField], templateUrl: './admin-dashboard.html', styleUrl: './admin-dashboard.scss' })
export class AdminDashboard {
  private readonly admin = inject(Admin);
  private readonly router = inject(Router);
  protected readonly dates = signal<BlockedDate[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly message = signal('');
  protected readonly errorMessage = signal('');
  protected readonly upcomingDates = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return this.dates().filter((item) => item.date >= today);
  });
  protected readonly model = signal({ startDate: '', endDate: '', reason: 'Nghỉ lễ/Tết' });
  protected readonly blockForm = form(this.model, (field) => {
    required(field.startDate, { message: 'Chọn ngày bắt đầu' });
    required(field.endDate, { message: 'Chọn ngày kết thúc' });
    maxLength(field.reason, 200, { message: 'Lý do tối đa 200 ký tự' });
    validate(field.endDate, ({ value }) => value() && value() < this.model().startDate
      ? { kind: 'dateRange', message: 'Ngày kết thúc phải sau ngày bắt đầu' } : undefined);
  });

  constructor() { void this.loadDates(); }
  private async loadDates(): Promise<void> {
    this.isLoading.set(true);
    try { this.dates.set((await firstValueFrom(this.admin.getBlockedDates())).dates); }
    catch (error) { this.handleError(error, 'Không thể tải lịch nghỉ.'); }
    finally { this.isLoading.set(false); }
  }
  protected save(): void {
    submit(this.blockForm, async () => {
      this.isSaving.set(true); this.message.set(''); this.errorMessage.set('');
      try {
        await firstValueFrom(this.admin.blockDates(this.model().startDate, this.model().endDate, this.model().reason));
        this.message.set('Đã cập nhật lịch ngừng nhận khách.');
        await this.loadDates();
      } catch (error) { this.handleError(error, 'Không thể khóa ngày đã chọn.'); }
      finally { this.isSaving.set(false); }
    });
  }
  protected async remove(date: string): Promise<void> {
    if (!confirm(`Mở nhận đặt vé trở lại cho ngày ${date}?`)) return;
    try {
      await firstValueFrom(this.admin.unblockDate(date));
      this.dates.update((dates) => dates.filter((item) => item.date !== date));
      this.message.set('Đã mở nhận khách cho ngày đã chọn.');
    } catch (error) { this.handleError(error, 'Không thể mở lại ngày này.'); }
  }
  protected async logout(): Promise<void> {
    try { await firstValueFrom(this.admin.logout()); }
    finally { await this.router.navigateByUrl('/admin/login'); }
  }
  private handleError(error: unknown, fallback: string): void {
    if (error instanceof HttpErrorResponse && error.status === 401) { void this.router.navigateByUrl('/admin/login'); return; }
    this.errorMessage.set(error instanceof HttpErrorResponse && error.error?.message ? error.error.message : fallback);
  }
}
