import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Supplier } from '../../../core/models/supplier.model';

@Component({
  selector: 'app-supplier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="p-6 max-w-lg font-sans">
      <div class="flex items-center justify-between mb-8">
        <h2 mat-dialog-title class="text-2xl font-bold text-slate-800 m-0 p-0 border-none">
          {{ data ? 'Edit Supplier' : 'Add New Supplier' }}
        </h2>
        <button mat-icon-button (click)="onCancel()" class="text-slate-400">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="supplierForm" (ngSubmit)="onSave()" class="space-y-6">
        <div class="space-y-1">
          <label class="text-sm font-semibold text-slate-700 ml-1">Supplier Name</label>
          <mat-form-field appearance="outline" class="w-full">
            <mat-icon matPrefix class="text-slate-400 mr-2">business</mat-icon>
            <input matInput formControlName="name" placeholder="Example Name">
            <mat-error *ngIf="supplierForm.get('name')?.hasError('required')">Name is required</mat-error>
          </mat-form-field>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-semibold text-slate-700 ml-1">Email</label>
            <mat-form-field appearance="outline" class="w-full">
              <mat-icon matPrefix class="text-slate-400 mr-2">email</mat-icon>
              <input matInput formControlName="contactEmail" type="email" placeholder="example@example.com">
              <mat-error *ngIf="supplierForm.get('contactEmail')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="supplierForm.get('contactEmail')?.hasError('email')">Invalid email</mat-error>
            </mat-form-field>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-semibold text-slate-700 ml-1">Phone</label>
            <mat-form-field appearance="outline" class="w-full">
              <mat-icon matPrefix class="text-slate-400 mr-2">phone</mat-icon>
              <input matInput formControlName="phone" placeholder="+60 123456789">
              <mat-error *ngIf="supplierForm.get('phone')?.hasError('required')">Phone is required</mat-error>
            </mat-form-field>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-semibold text-slate-700 ml-1">Address</label>
          <mat-form-field appearance="outline" class="w-full">
            <mat-icon matPrefix class="text-slate-400 mr-2">location_on</mat-icon>
            <textarea matInput formControlName="address" rows="3" placeholder="123 Street, City, State"></textarea>
            <mat-error *ngIf="supplierForm.get('address')?.hasError('required')">Address is required</mat-error>
          </mat-form-field>
        </div>

        <div mat-dialog-actions class="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-8">
          <button mat-button (click)="onCancel()" class="px-6 rounded-xl font-bold">Cancel</button>
          <button mat-flat-button color="primary" type="submit" [disabled]="supplierForm.invalid" 
                  class="px-8 py-6 rounded-xl font-bold shadow-lg shadow-blue-100">
            {{ data ? 'Update Supplier' : 'Add Supplier' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface { border-radius: 24px !important; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .mat-mdc-text-field-wrapper { background-color: #f8fafc !important; border-radius: 12px !important; }
  `]
})
export class SupplierDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SupplierDialogComponent>);
  data = inject<Supplier | null>(MAT_DIALOG_DATA);

  supplierForm: FormGroup = this.fb.group({
    name: [this.data?.name || '', [Validators.required]],
    contactEmail: [this.data?.contactEmail || '', [Validators.required, Validators.email]],
    phone: [this.data?.phone || '', [Validators.required]],
    address: [this.data?.address || '', [Validators.required]]
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.supplierForm.valid) {
      this.dialogRef.close(this.supplierForm.value);
    }
  }
}
