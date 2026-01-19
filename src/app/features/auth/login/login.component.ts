import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div class="w-full max-w-md">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 mb-4 animate-bounce">
            <mat-icon class="text-3xl">shopping_basket</mat-icon>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p class="text-slate-500 mt-2">Log in to manage your procurement flow.</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-icon matPrefix class="text-slate-400 mr-2">email</mat-icon>
                <input matInput formControlName="email" type="email" placeholder="name@company.com">
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email address</mat-error>
              </mat-form-field>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-icon matPrefix class="text-slate-400 mr-2">lock</mat-icon>
                <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="••••••••">
                <button type="button" mat-icon-button matSuffix (click)="hidePassword.set(!hidePassword())" class="text-slate-400">
                  <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
              </mat-form-field>
            </div>

            <button mat-flat-button color="primary" type="submit" 
                    [disabled]="loginForm.invalid || isLoading()"
                    class="w-full py-6 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all">
              <span *ngIf="!isLoading()">Sign In</span>
              <div *ngIf="isLoading()" class="flex items-center gap-2">
                <mat-icon class="animate-spin text-sm">refresh</mat-icon>
                Authenticating...
              </div>
            </button>
          </form>

          <div class="mt-8 text-center">
            <p class="text-slate-500 text-sm">
              Don't have an account? 
              <a routerLink="/auth/register" class="text-blue-600 font-bold hover:underline ml-1">Create one</a>
            </p>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="mt-8 text-center text-xs text-slate-400">
          Built for modern procurement teams. &copy; 2026 ProcureFlow
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    ::ng-deep .mat-mdc-text-field-wrapper {
      background-color: #f8fafc !important;
      border-radius: 16px !important;
    }
    ::ng-deep .mat-mdc-form-field-outline-thick {
      border-color: #3b82f6 !important;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  hidePassword = signal(true);
  isLoading = signal(false);

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const credentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.snackBar.open('Welcome back!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open(err.error?.message || 'Login failed. Please check your credentials.', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
