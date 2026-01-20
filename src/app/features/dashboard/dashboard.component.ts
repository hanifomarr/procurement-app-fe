import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from './services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p class="text-slate-500">Real-time performance metrics and procurement health.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Summary Cards -->
        <mat-card class="p-6 border-none shadow-sm bg-white hover:shadow-lg transition-all rounded-2xl group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
              <h3 class="text-3xl font-black text-slate-800">{{ stats()?.totalPurchaseOrders || 0 }}</h3>
            </div>
            <div class="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <mat-icon class="scale-125">shopping_cart</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-bold">
            <span class="text-blue-500">Inventory requests</span>
          </div>
        </mat-card>

        <mat-card class="p-6 border-none shadow-sm bg-white hover:shadow-lg transition-all rounded-2xl group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <h3 class="text-3xl font-black text-slate-800">{{ stats()?.pendingApprovals || 0 }}</h3>
            </div>
            <div class="p-4 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <mat-icon class="scale-125">pending_actions</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-bold text-amber-500">
            <span>Action required</span>
          </div>
        </mat-card>

        <mat-card class="p-6 border-none shadow-sm bg-white hover:shadow-lg transition-all rounded-2xl group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider">Suppliers</p>
              <h3 class="text-3xl font-black text-slate-800">{{ stats()?.totalSuppliers || 0 }}</h3>
            </div>
            <div class="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <mat-icon class="scale-125">business</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-bold text-purple-500">
            <span>Active network</span>
          </div>
        </mat-card>

        <mat-card class="p-6 border-none shadow-sm bg-white hover:shadow-lg transition-all rounded-2xl group">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Spent</p>
              <h3 class="text-2xl font-black text-slate-800">
                {{ stats()?.totalSpent | currency:'RM':'symbol':'1.0-0' }}
              </h3>
            </div>
            <div class="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <mat-icon class="scale-125">payments</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-bold text-emerald-500">
            <span>Financial utilization</span>
          </div>
        </mat-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <mat-card class="p-8 border-none shadow-sm bg-white rounded-3xl">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-black text-slate-800">Recent Purchase Orders</h2>
            <button class="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors" routerLink="/purchase-orders">View All</button>
          </div>
          <div class="space-y-4">
            <div *ngFor="let po of stats()?.recentPurchaseOrders" 
                 class="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-500">
                  <mat-icon>description</mat-icon>
                </div>
                <div>
                  <p class="font-bold text-slate-800">{{ po.poNumber }}</p>
                  <p class="text-xs font-bold text-slate-400 tracking-wide uppercase">
                    {{ po.supplierName }} • {{ po.orderDate | date:'mediumDate' }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-black text-slate-900">{{ po.totalAmount | currency:'RM':'symbol':'1.2-2' }}</p>
                <span [ngClass]="{
                  'bg-slate-100 text-slate-500': po.status === 'DRAFT',
                  'bg-blue-100 text-blue-700': po.status === 'SUBMITTED'
                }" class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {{ po.status }}
                </span>
              </div>
            </div>

            <div *ngIf="!stats()?.recentPurchaseOrders?.length" class="py-12 text-center text-slate-400">
              <mat-icon class="text-4xl mb-2 opacity-20">history</mat-icon>
              <p class="font-bold italic">No recent orders found</p>
            </div>
          </div>
        </mat-card>

        <!-- Supplier Analysis -->
        <mat-card class="p-8 border-none shadow-sm bg-white rounded-3xl">
          <h2 class="text-xl font-black text-slate-800 mb-6">Supplier Analysis</h2>
          <div class="space-y-5">
            <div *ngFor="let stat of stats()?.supplierStats" class="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span class="font-bold text-slate-700">{{ stat.supplierName }}</span>
                </div>
                <span class="text-xs font-black text-slate-400 uppercase tracking-tighter">{{ stat.totalOrders }} Orders</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <div class="flex-1 bg-white h-2 rounded-full overflow-hidden border border-slate-100">
                  <div class="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                       [style.width.%]="(stat.totalSpent / (stats()?.totalSpent || 1)) * 100"></div>
                </div>
                <span class="text-sm font-black text-slate-900 whitespace-nowrap">{{ stat.totalSpent | currency:'RM':'symbol':'1.0-0' }}</span>
              </div>
            </div>

            <div *ngIf="!stats()?.supplierStats?.length" class="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
              <mat-icon class="text-5xl text-slate-200 mb-4">insights</mat-icon>
              <p class="text-slate-400 font-bold">No supplier data available</p>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
      min-height: 100%;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  stats = signal<DashboardStats | null>(null);

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error fetching dashboard stats:', err)
    });
  }
}
