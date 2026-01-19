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
  selector: 'app-register',
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
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 mb-4">
            <mat-icon class="text-3xl">person_add_alt</mat-icon>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p class="text-slate-500 mt-2">Join ProcureFlow and streamline your workflows.</p>
        </div>

        <!-- Register Card -->
        <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-icon matPrefix class="text-slate-400 mr-2">person</mat-icon>
                <input matInput formControlName="name" placeholder="John Doe">
                <mat-error *ngIf="registerForm.get('name')?.hasError('required')">Name is required</mat-error>
              </mat-form-field>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-icon matPrefix class="text-slate-400 mr-2">email</mat-icon>
                <input matInput formControlName="email" type="email" placeholder="name@company.com">
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Invalid email address</mat-error>
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
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Password must be at least 6 characters</mat-error>
              </mat-form-field>
            </div>

            <button mat-flat-button color="primary" type="submit" 
                    [disabled]="registerForm.invalid || isLoading()"
                    class="w-full py-6 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all">
              <span *ngIf="!isLoading()">Sign Up</span>
              <div *ngIf="isLoading()" class="flex items-center gap-2">
                <mat-icon class="animate-spin text-sm">refresh</mat-icon>
                Creating account...
              </div>
            </button>
          </form>

          <div class="mt-8 text-center">
            <p class="text-slate-500 text-sm">
              Already have an account? 
              <a routerLink="/auth/login" class="text-blue-600 font-bold hover:underline ml-1">Log in here</a>
            </p>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="mt-8 text-center text-xs text-slate-400">
          Professional procurement at your fingertips.
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
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  hidePassword = signal(true);
  isLoading = signal(false);

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const userData = {
        name: this.registerForm.value.name!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.snackBar.open('Registration successful! Please log in.', 'Close', { duration: 5000 });
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.snackBar.open(err.error?.message || 'Registration failed. Try again.', 'Close', { 
            duration: 5000 
          });
        }
      });
    }
  }
}
