import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrder, POStatus } from '../../../core/models/purchase-order.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-po-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="p-6">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800">Purchase Orders</h1>
          <p class="text-slate-500">Track and manage your procurement request inventory.</p>
        </div>
        <button mat-flat-button color="primary" class="rounded-xl px-6 py-6 font-bold shadow-sm">
          <mat-icon class="mr-2">add</mat-icon>
          Create PO
        </button>
      </header>

      <mat-card class="overflow-hidden border-none shadow-sm bg-white">
        <table mat-table [dataSource]="orders" class="w-full">
          <!-- PO Number -->
          <ng-container matColumnDef="poNumber">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold py-4 px-6"> PO Number </th>
            <td mat-cell *matCellDef="let order" class="py-4 px-6 font-bold text-blue-600"> {{order.poNumber}} </td>
          </ng-container>

          <!-- Supplier -->
          <ng-container matColumnDef="supplier">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold"> Supplier </th>
            <td mat-cell *matCellDef="let order" class="text-slate-800 font-medium"> {{order.supplierName}} </td>
          </ng-container>

          <!-- Status -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold"> Status </th>
            <td mat-cell *matCellDef="let order"> 
              <span [ngClass]="{
                'bg-slate-100 text-slate-600': order.status === POStatus.DRAFT,
                'bg-blue-100 text-blue-700': order.status === POStatus.SUBMITTED
              }" class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{order.status}}
              </span>
            </td>
          </ng-container>

          <!-- Items -->
          <ng-container matColumnDef="items">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold hidden md:table-cell"> Items </th>
            <td mat-cell *matCellDef="let order" class="text-slate-500 hidden md:table-cell"> {{order.items.length}} types </td>
          </ng-container>

          <!-- Amount -->
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef class="bg-slate-50 text-slate-600 font-bold text-right px-6"> Total Amount </th>
            <td mat-cell *matCellDef="let order" class="text-right px-6 font-bold text-slate-900"> {{order.totalAmount | currency}} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-50 transition-colors cursor-pointer"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class POListComponent implements OnInit {
  private poService = inject(PurchaseOrderService);
  
  POStatus = POStatus;
  orders: PurchaseOrder[] = [];
  displayedColumns: string[] = ['poNumber', 'supplier', 'status', 'items', 'amount'];

  ngOnInit() {
    this.poService.getPurchaseOrders().subscribe(data => {
      this.orders = data;
    });
  }
}
