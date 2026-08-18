import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Admin } from '../services/admin';

export const adminGuard: CanActivateFn = async (_route, state) => {
  const admin = inject(Admin);
  const router = inject(Router);
  try {
    await firstValueFrom(admin.session());
    return true;
  } catch {
    return router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
  }
};
