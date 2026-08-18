import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormField, form, minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Admin } from '../../services/admin';

@Component({ selector: 'app-admin-login', imports: [FormField, RouterLink], templateUrl: './admin-login.html', styleUrl: './admin-login.scss' })
export class AdminLogin {
  private readonly admin = inject(Admin);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly model = signal({ username: '', password: '' });
  protected readonly loginForm = form(this.model, (field) => {
    required(field.username, { message: 'Nhập tài khoản quản trị' });
    required(field.password, { message: 'Nhập mật khẩu' });
    minLength(field.password, 10, { message: 'Mật khẩu có ít nhất 10 ký tự' });
  });
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');
  protected onSubmit(): void {
    submit(this.loginForm, async () => {
      this.isSubmitting.set(true); this.errorMessage.set('');
      try {
        await firstValueFrom(this.admin.login(this.model().username.trim(), this.model().password));
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin';
        await this.router.navigateByUrl(returnUrl.startsWith('/admin') ? returnUrl : '/admin');
      } catch (error) {
        this.errorMessage.set(error instanceof HttpErrorResponse && error.error?.message ? error.error.message : 'Không thể đăng nhập. Kiểm tra kết nối và thử lại.');
      } finally { this.isSubmitting.set(false); }
    });
  }
}
