import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="flex h-screen bg-slate-50 font-sans text-slate-900">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-slate-200 flex flex-col transition-all duration-300">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <mat-icon class="text-lg">shopping_basket</mat-icon>
            </div>
            <span class="text-lg font-bold tracking-tight text-slate-800">Procurement App</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          <a routerLink="/dashboard" routerLinkActive="bg-blue-50 text-blue-600 shadow-sm"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <mat-icon class="text-slate-400 group-hover:text-blue-500">dashboard</mat-icon>
            <span class="font-medium">Dashboard</span>
          </a>

          <div class="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Procurement
          </div>

          <a routerLink="/purchase-orders" routerLinkActive="bg-blue-50 text-blue-600 shadow-sm"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <mat-icon class="text-slate-400 group-hover:text-blue-500">description</mat-icon>
            <span class="font-medium">Purchase Orders</span>
          </a>

          <a routerLink="/suppliers" routerLinkActive="bg-blue-50 text-blue-600 shadow-sm"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <mat-icon class="text-slate-400 group-hover:text-blue-500">business</mat-icon>
            <span class="font-medium">Suppliers</span>
          </a>

          <div class="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>

          <a routerLink="/settings" routerLinkActive="bg-blue-50 text-blue-600 shadow-sm"
             class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <mat-icon class="text-slate-400 group-hover:text-blue-500">settings</mat-icon>
            <span class="font-medium">Settings</span>
          </a>
        </nav>

        <!-- Profile / Footer -->
        <div class="p-4 border-t border-slate-200">
          <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              U
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-slate-800 truncate">User</p>
              <p class="text-xs text-slate-500 truncate">Staff</p>
            </div>
            <mat-icon class="text-slate-400 text-sm">more_vert</mat-icon>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Topbar -->
        <header class="h-16 bg-white gap-4 border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div class="flex items-center gap-4 flex-1">
            <div class="relative w-full max-w-md hidden md:block">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</mat-icon>
              <input type="text" placeholder="Search POs, suppliers..." 
                     class="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none">
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button mat-flat-button color="primary" class="rounded-xl px-4 py-2 font-bold shadow-sm shadow-blue-200">
              <mat-icon class="mr-1">add</mat-icon>
              Create New PO
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-slate-50">
          <div class="mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    
    /* Custom Mat Icon Tweak */
    .mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class MainLayoutComponent {}
