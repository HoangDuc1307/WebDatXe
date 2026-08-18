import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { environment } from '../../environments/environment';

export interface BlockedDate { date: string; reason: string; }

@Service()
export class Admin {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;
  private readonly options = { withCredentials: true } as const;
  login(username: string, password: string) { return this.http.post<{ username: string }>(`${this.apiUrl}/login`, { username, password }, this.options); }
  session() { return this.http.get<{ username: string }>(`${this.apiUrl}/session`, this.options); }
  logout() { return this.http.post<void>(`${this.apiUrl}/logout`, {}, this.options); }
  getBlockedDates() { return this.http.get<{ dates: BlockedDate[] }>(`${this.apiUrl}/blocked-dates`, this.options); }
  blockDates(startDate: string, endDate: string, reason: string) { return this.http.post<{ dates: BlockedDate[] }>(`${this.apiUrl}/blocked-dates`, { startDate, endDate, reason }, this.options); }
  unblockDate(date: string) { return this.http.delete<void>(`${this.apiUrl}/blocked-dates/${date}`, this.options); }
}
