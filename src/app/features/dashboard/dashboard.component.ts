import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p class="text-slate-500">Welcome back! Here's what's happening today.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Summary Cards -->
        <mat-card class="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Total Purchase Orders</p>
              <h3 class="text-2xl font-bold text-slate-800">128</h3>
            </div>
            <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <mat-icon>shopping_cart</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-emerald-500 font-medium">+12%</span>
            <span class="text-slate-400 ml-2">from last month</span>
          </div>
        </mat-card>

        <mat-card class="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Pending Approvals</p>
              <h3 class="text-2xl font-bold text-slate-800">14</h3>
            </div>
            <div class="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <mat-icon>pending_actions</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-amber-500 font-medium">Attention needed</span>
          </div>
        </mat-card>

        <mat-card class="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Total Suppliers</p>
              <h3 class="text-2xl font-bold text-slate-800">42</h3>
            </div>
            <div class="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <mat-icon>business</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-slate-400">3 new this week</span>
          </div>
        </mat-card>

        <mat-card class="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-500">Total Spent</p>
              <h3 class="text-2xl font-bold text-slate-800">$45.2k</h3>
            </div>
            <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <mat-icon>payments</mat-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-sm">
            <span class="text-emerald-500 font-medium">+8%</span>
            <span class="text-slate-400 ml-2">budget utilization</span>
          </div>
        </mat-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity Placeholder -->
        <mat-card class="p-6 border-none shadow-sm bg-white">
          <h2 class="text-lg font-bold text-slate-800 mb-4">Recent Purchase Orders</h2>
          <div class="space-y-4">
            <div *ngFor="let i of [1,2,3]" class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {{ i }}
                </div>
                <div>
                  <p class="font-medium text-slate-800">PO-2024-00{{i}}</p>
                  <p class="text-sm text-slate-500">Global Tech Solutions</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-slate-800">$1,200.00</p>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Submitted
                </span>
              </div>
            </div>
          </div>
        </mat-card>

        <mat-card class="p-6 border-none shadow-sm bg-white">
          <h2 class="text-lg font-bold text-slate-800 mb-4">Supplier Overview</h2>
          <div class="flex items-center justify-center min-h-[200px] text-slate-400">
            <div class="text-center">
              <mat-icon class="text-4xl mb-2">bar_chart</mat-icon>
              <p>Supplier distribution chart placeholder</p>
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
export class DashboardComponent {}
