import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../services/supplier.service';
import { Supplier } from '../../../core/models/supplier.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SupplierDialogComponent } from '../supplier-dialog/supplier-dialog.component';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="p-6">
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Suppliers</h1>
          <p class="text-sm sm:text-base text-slate-500">Manage your vendor network.</p>
        </div>
        
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div class="relative w-full sm:w-64">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</mat-icon>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)" 
                   placeholder="Search..." 
                   class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
          </div>
          <button mat-flat-button color="primary" (click)="openSupplierDialog()" 
                  class="rounded-xl px-4 py-6 font-bold shadow-lg shadow-blue-100 flex items-center justify-center">
            <mat-icon class="sm:mr-2">add</mat-icon>
            <span class="sm:inline">Add Supplier</span>
          </button>
        </div>
      </header>

      <mat-card class="overflow-hidden border-none shadow-sm bg-white rounded-2xl">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="filteredSuppliers()" class="w-full">
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold py-4 px-4 sm:px-6 border-b border-slate-100"> Name </th>
              <td mat-cell *matCellDef="let supplier" class="py-4 px-4 sm:px-6 font-semibold text-slate-800"> {{supplier.name}} </td>
            </ng-container>
 
            <!-- Email Column -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-100 hidden sm:table-cell"> Email </th>
              <td mat-cell *matCellDef="let supplier" class="text-slate-600 hidden sm:table-cell"> 
                <div class="flex items-center gap-2">
                  <mat-icon class="text-slate-300 text-sm">email</mat-icon>
                  <span class="truncate max-w-[150px] lg:max-w-none">{{supplier.contactEmail}}</span>
                </div>
              </td>
            </ng-container>
 
            <!-- Phone Column -->
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-100 hidden md:table-cell"> Phone </th>
              <td mat-cell *matCellDef="let supplier" class="text-slate-600 hidden md:table-cell"> {{supplier.phone}} </td>
            </ng-container>
 
            <!-- Address Column -->
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-100 hidden lg:table-cell"> Address </th>
              <td mat-cell *matCellDef="let supplier" class="text-slate-500 text-sm hidden lg:table-cell max-w-xs truncate"> {{supplier.address}} </td>
            </ng-container>
 
            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold text-right px-4 sm:px-6 border-b border-slate-100"> Actions </th>
              <td mat-cell *matCellDef="let supplier" class="text-right px-4 sm:px-6">
                <div class="flex justify-end gap-1">
                  <button mat-icon-button (click)="openSupplierDialog(supplier)" 
                          class="p-0 text-slate-400 hover:text-blue-600 transition-colors" matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteSupplier(supplier)" 
                          class="p-0 text-slate-400 hover:text-red-600 transition-colors" matTooltip="Delete">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>
 
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-50/80 transition-colors"></tr>
          </table>
        </div>

        <!-- Empty/Loading State -->
        <div *ngIf="filteredSuppliers().length === 0" class="py-24 text-center">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <mat-icon class="text-4xl">business_off</mat-icon>
          </div>
          <h3 class="text-lg font-bold text-slate-800">No suppliers found</h3>
          <p class="text-slate-500 mt-1">Try adjusting your search or add a new vendor.</p>
          <button mat-stroked-button color="primary" class="mt-6 rounded-xl font-bold" (click)="openSupplierDialog()">
            Add First Supplier
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .mat-column-actions { width: 120px; }
    .mat-column-name { min-width: 200px; }
    .mat-icon { font-size: 20px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class SupplierListComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  suppliers = signal<Supplier[]>([]);
  searchQuery = '';
  displayedColumns: string[] = ['name', 'email', 'phone', 'address', 'actions'];

  filteredSuppliers = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.suppliers();
    return this.suppliers().filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.contactEmail.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (data) => this.suppliers.set(data),
      error: () => this.showError('Failed to load suppliers')
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  openSupplierDialog(supplier?: Supplier) {
    const dialogRef = this.dialog.open(SupplierDialogComponent, {
      data: supplier || null,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (supplier) {
          this.updateSupplier(supplier.id, result);
        } else {
          this.createSupplier(result);
        }
      }
    });
  }

  private createSupplier(data: Omit<Supplier, 'id'>) {
    this.supplierService.addSupplier(data).subscribe({
      next: () => {
        this.loadSuppliers();
        this.showSuccess('Supplier added successfully');
      },
      error: () => this.showError('Failed to add supplier')
    });
  }

  private updateSupplier(id: string, data: Partial<Supplier>) {
    this.supplierService.updateSupplier(id, data).subscribe({
      next: () => {
        this.loadSuppliers();
        this.showSuccess('Supplier updated successfully');
      },
      error: () => this.showError('Failed to update supplier')
    });
  }

  deleteSupplier(supplier: Supplier) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Supplier',
        message: `Are you sure you want to delete ${supplier.name}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.supplierService.deleteSupplier(supplier.id).subscribe({
          next: () => {
            this.loadSuppliers();
            this.showSuccess('Supplier deleted successfully');
          },
          error: () => this.showError('Failed to delete supplier')
        });
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['bg-red-600', 'text-white'] });
  }
}
