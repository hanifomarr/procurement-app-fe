import { Component, OnInit, inject, signal, ViewChild, ElementRef, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from './services/dashboard.service';
import { DashboardStats, RecentPurchaseOrder } from '../../core/models/dashboard.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterLink],
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
                 (click)="navigateToOrder(po)"
                 tabindex="0"
                 role="link"
                 (keydown.enter)="navigateToOrder(po)"
                 (keydown.space)="navigateToOrder(po)"
                 class="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 cursor-pointer group/item outline-none focus:ring-2 focus:ring-blue-100">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-500">
                  <mat-icon>description</mat-icon>
                </div>
                <div>
                  <p class="font-bold text-slate-800 group-hover/item:text-blue-600 transition-colors">{{ po.poNumber }}</p>
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

        <!-- Supplier Analysis Chart -->
        <mat-card class="p-8 border-none shadow-sm bg-white rounded-3xl">
          <h2 class="text-xl font-black text-slate-800 mb-6">Supplier Expenditure Share</h2>
          <div class="relative h-[300px] flex items-center justify-center">
            <canvas #supplierChart></canvas>
            <div *ngIf="!stats()?.supplierStats?.length" class="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
              <mat-icon class="text-5xl text-slate-200 mb-4">insights</mat-icon>
              <p class="text-slate-400 font-bold">No supplier data available</p>
            </div>
          </div>
          
          <div class="mt-8 grid grid-cols-2 gap-4">
            <div *ngFor="let stat of stats()?.supplierStats; let i = index" class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" [style.backgroundColor]="chartColors[i % chartColors.length]"></div>
              <div>
                <p class="text-xs font-bold text-slate-700 truncate w-24">{{ stat.supplierName }}</p>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ stat.totalSpent | currency:'RM':'symbol':'1.0-0' }}</p>
              </div>
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
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  
  @ViewChild('supplierChart') supplierChartRef!: ElementRef<HTMLCanvasElement>;
  
  stats = signal<DashboardStats | null>(null);
  chart: Chart | null = null;
  
  chartColors = [
    '#3b82f6', // blue-500
    '#8b5cf6', // purple-500
    '#ec4899', // pink-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#6366f1', // indigo-500
    '#f43f5e'  // rose-500
  ];

  constructor() {
    // Update chart whenever stats change
    effect(() => {
      const data = this.stats();
      if (data && this.supplierChartRef) {
        this.updateChart(data);
      }
    });
  }

  ngOnInit() {
    this.dashboardService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error fetching dashboard stats:', err)
    });
  }

  ngAfterViewInit() {
    const data = this.stats();
    if (data) {
      this.updateChart(data);
    }
  }

  private updateChart(data: DashboardStats) {
    if (!this.supplierChartRef) return;

    const ctx = this.supplierChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = data.supplierStats.map(s => s.supplierName);
    const values = data.supplierStats.map(s => s.totalSpent);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: this.chartColors,
          borderWidth: 0,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { family: 'Inter', size: 14, weight: 'bold' },
            bodyFont: { family: 'Inter', size: 12 },
            padding: 12,
            cornerRadius: 12,
            displayColors: true,
            callbacks: {
              label: (item) => {
                const val = item.raw as number;
                return ` RM ${val.toLocaleString()}`;
              }
            }
          }
        },
        cutout: '75%'
      }
    });
  }
 
  navigateToOrder(po: RecentPurchaseOrder) {
    if (po.id) {
      this.router.navigate(['/purchase-orders', po.id]);
    } else {
      console.warn('Purchase Order ID is missing for:', po.poNumber);
      // Fallback to poNumber if backend supports it OR just navigate to list
      this.router.navigate(['/purchase-orders']);
    }
  }
}
