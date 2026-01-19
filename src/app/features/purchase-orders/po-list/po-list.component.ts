import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrder, POStatus } from '../../../core/models/purchase-order.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-po-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterLink,
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule, 
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDividerModule
  ],
  template: `
    <div class="p-6">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Purchase Orders</h1>
          <p class="text-slate-500">Track and manage your procurement request inventory.</p>
        </div>
        
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-64">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</mat-icon>
            <input type="text" [(ngModel)]="searchQuery"
                   placeholder="Search POs..." 
                   class="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm">
          </div>
          <button mat-flat-button color="primary" routerLink="/purchase-orders/create"
                  class="rounded-xl px-6 py-6 font-bold shadow-lg shadow-blue-100 whitespace-nowrap">
            <mat-icon class="mr-2">add</mat-icon>
            Create PO
          </button>
        </div>
      </header>

      <!-- Status Filter Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button *ngFor="let tab of statusTabs" 
                (click)="activeTab.set(tab.value)"
                [class]="activeTab() === tab.value ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'"
                class="px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border border-slate-100">
          {{ tab.label }}
          <span class="ml-2 px-2 py-0.5 rounded-full text-xs" 
                [class]="activeTab() === tab.value ? 'bg-blue-500' : 'bg-slate-100'">
            {{ getCount(tab.value) }}
          </span>
        </button>
      </div>

      <mat-card class="overflow-hidden border-none shadow-sm bg-white rounded-2xl">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="filteredOrders()" class="w-full">
            <!-- PO Number -->
            <ng-container matColumnDef="poNumber">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold py-4 px-6 border-b border-slate-100"> Number </th>
              <td mat-cell *matCellDef="let order" class="py-4 px-6 font-bold text-blue-600"> {{order.poNumber}} </td>
            </ng-container>

            <!-- Supplier -->
            <ng-container matColumnDef="supplier">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-100"> Supplier </th>
              <td mat-cell *matCellDef="let order" class="text-slate-800 font-medium"> {{order.supplierName}} </td>
            </ng-container>

            <!-- Status -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-100"> Status </th>
              <td mat-cell *matCellDef="let order"> 
                <span [ngClass]="{
                  'bg-slate-100 text-slate-600': order.status === POStatus.DRAFT,
                  'bg-blue-100 text-blue-700': order.status === POStatus.SUBMITTED
                }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/50">
                  {{order.status}}
                </span>
              </td>
            </ng-container>

            <!-- Items -->
            <ng-container matColumnDef="items">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold border-b border-slate-100 hidden md:table-cell"> Items </th>
              <td mat-cell *matCellDef="let order" class="text-slate-500 hidden md:table-cell"> 
                {{order.items?.length || 0}} item(s)
              </td>
            </ng-container>

            <!-- Amount -->
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold text-right px-6 border-b border-slate-100"> Total </th>
              <td mat-cell *matCellDef="let order" class="text-right px-6 font-black text-slate-900"> {{order.totalAmount | currency:'RM':'symbol':'1.2-2'}} </td>
            </ng-container>

            <!-- Actions -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="bg-slate-50/50 text-slate-600 font-bold text-right px-6 border-b border-slate-100"></th>
              <td mat-cell *matCellDef="let order" class="text-right px-6">
                <button mat-icon-button [matMenuTriggerFor]="menu" class="text-slate-400">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu" class="rounded-2xl shadow-xl border border-slate-100">
                  <button mat-menu-item *ngIf="order.id" [routerLink]="['/purchase-orders/edit', order.id]">
                    <mat-icon class="text-blue-500">edit</mat-icon>
                    <span>Edit Order</span>
                  </button>
                  <button mat-menu-item *ngIf="order.status === POStatus.DRAFT" (click)="changeStatus(order, POStatus.SUBMITTED)">
                    <mat-icon class="text-green-500">send</mat-icon>
                    <span>Submit PO</span>
                  </button>
                  <mat-divider></mat-divider>
                  <button mat-menu-item (click)="deleteOrder(order)" class="text-red-600">
                    <mat-icon class="text-red-500">delete_outline</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-50/80 transition-colors"></tr>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredOrders().length === 0" class="py-24 text-center">
          <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <mat-icon class="text-4xl">description</mat-icon>
          </div>
          <h3 class="text-lg font-bold text-slate-800">No purchase orders found</h3>
          <p class="text-slate-500 mt-1">Start by creating your first procurement request.</p>
          <button mat-stroked-button color="primary" class="mt-6 rounded-xl font-bold" routerLink="/purchase-orders/create">
            Create First PO
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .mat-icon { font-size: 20px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
  `]
})
export class POListComponent implements OnInit {
  private poService = inject(PurchaseOrderService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  
  POStatus = POStatus;
  orders = signal<PurchaseOrder[]>([]);
  searchQuery = '';
  activeTab = signal<string>('ALL');

  statusTabs = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Drafts', value: POStatus.DRAFT },
    { label: 'Submitted', value: POStatus.SUBMITTED }
  ];

  displayedColumns: string[] = ['poNumber', 'supplier', 'status', 'items', 'amount', 'actions'];

  filteredOrders = computed(() => {
    let filtered = this.orders();
    
    // Status Filter
    if (this.activeTab() !== 'ALL') {
      filtered = filtered.filter(o => o.status === this.activeTab());
    }

    // Search Filter
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(o => 
        o.poNumber.toLowerCase().includes(query) || 
        o.supplierName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.poService.getPurchaseOrders().subscribe({
      next: (data) => {
        console.log('Fetched POs:', data);
        this.orders.set(data);
      },
      error: () => this.showError('Failed to load purchase orders')
    });
  }

  getCount(status: string) {
    if (status === 'ALL') return this.orders().length;
    return this.orders().filter(o => o.status === status).length;
  }

  changeStatus(order: PurchaseOrder, status: POStatus) {
    this.poService.updateStatus(order.id, status).subscribe({
      next: () => {
        this.loadOrders();
        this.showSuccess(`Order ${order.poNumber} status updated to ${status}`);
      },
      error: () => this.showError('Failed to update order status')
    });
  }

  deleteOrder(order: PurchaseOrder) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Order',
        message: `Are you sure you want to delete ${order.poNumber}?`
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.poService.deletePurchaseOrder(order.id).subscribe({
          next: () => {
            this.loadOrders();
            this.showSuccess('Order deleted successfully');
          },
          error: () => this.showError('Failed to delete order')
        });
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}
