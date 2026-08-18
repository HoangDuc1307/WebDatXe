import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/booking-form/booking-form').then((m) => m.BookingForm) },
  { path: 'admin/login', loadComponent: () => import('./features/admin-login/admin-login').then((m) => m.AdminLogin) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./features/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard) },
  { path: '**', redirectTo: '' },
];
