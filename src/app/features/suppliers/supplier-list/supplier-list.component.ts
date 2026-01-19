import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../services/supplier.service';
import { Supplier } from '../../../core/models/supplier.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    MatTooltipModule
  ],
  template: `
    <div class="p-6">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Suppliers</h1>
          <p class="text-slate-500">Manage your vendor relationships and contact details.</p>
        </div>
        <button mat-flat-button color="primary" class="rounded-xl px-6 py-6 font-bold shadow-sm">
          <mat-icon class="mr-2">add</mat-icon>
          Add Supplier
        </button>
      </header>

      <mat-card class="overflow-hidden border-none shadow-sm bg-white">
        <table mat-table [dataSource]="suppliers" class="w-full">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold py-4"> Supplier Name </th>
            <td mat-cell *matCellDef="let supplier" class="py-4 font-medium text-slate-800"> {{supplier.name}} </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold"> Contact Email </th>
            <td mat-cell *matCellDef="let supplier" class="text-slate-600"> {{supplier.contactEmail}} </td>
          </ng-container>

          <!-- Phone Column -->
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold"> Phone </th>
            <td mat-cell *matCellDef="let supplier" class="text-slate-600"> {{supplier.phone}} </td>
          </ng-container>

          <!-- Address Column -->
          <ng-container matColumnDef="address">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold hidden md:table-cell"> Address </th>
            <td mat-cell *matCellDef="let supplier" class="text-slate-500 text-sm hidden md:table-cell"> {{supplier.address}} </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold text-right px-6"> Actions </th>
            <td mat-cell *matCellDef="let supplier" class="text-right px-6">
              <button mat-icon-button class="text-slate-400 hover:text-blue-600">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button class="text-slate-400 hover:text-red-600">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-50 transition-colors"></tr>
        </table>

        <!-- Empty State -->
        <div *ngIf="suppliers.length === 0" class="py-20 text-center text-slate-400">
          <mat-icon class="text-6xl mb-4">business_off</mat-icon>
          <p>No suppliers found. Start by adding one!</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .mat-column-actions {
      width: 120px;
    }
  `]
})
export class SupplierListComponent implements OnInit {
  private supplierService = inject(SupplierService);
  
  suppliers: Supplier[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'address', 'actions'];

  ngOnInit() {
    this.supplierService.getSuppliers().subscribe(data => {
      this.suppliers = data;
    });
  }
}
