import { Component, inject } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6 max-w-sm text-center font-sans">
      <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <mat-icon class="text-3xl">warning</mat-icon>
      </div>
      <h2 mat-dialog-title class="text-xl font-bold text-slate-800 border-none mb-2">
        {{ data.title || 'Confirm Action' }}
      </h2>
      <div mat-dialog-content class="text-slate-500 mb-8 border-none">
        {{ data.message || 'Are you sure you want to proceed with this action?' }}
      </div>
      <div mat-dialog-actions class="flex justify-center gap-3 border-none p-0">
        <button mat-button (click)="onCancel()" class="px-6 rounded-xl font-bold">Cancel</button>
        <button mat-flat-button color="warn" (click)="onConfirm()" class="px-6 rounded-xl font-bold">
          Confirm
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface { border-radius: 24px !important; }
  `]
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data = inject<{ title: string, message: string }>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
