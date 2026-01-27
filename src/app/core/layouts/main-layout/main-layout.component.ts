import { Component, inject, signal } from '@angular/core';

import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatMenuModule
],
  template: `
    <div class="flex h-screen bg-slate-50 font-sans text-slate-900 relative">
      <!-- Mobile Backdrop -->
      @if (isSidebarOpen()) {
        <div
          (click)="toggleSidebar()"
          class="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity">
        </div>
      }
    
      <!-- Sidebar -->
      <aside [class.translate-x-0]="isSidebarOpen()"
        [class.-translate-x-full]="!isSidebarOpen()"
        class="fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col z-30 transition-transform duration-300 md:translate-x-0">
        <!-- Logo -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <mat-icon class="text-lg">shopping_basket</mat-icon>
            </div>
            <a routerLink="/dashboard">
              <span class="text-lg font-bold tracking-tight text-slate-800 ">nProcurement</span>
            </a>
          </div>
          <button (click)="toggleSidebar()" class="md:hidden text-slate-400 p-1">
            <mat-icon>close</mat-icon>
          </button>
        </div>
    
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          <a routerLink="/dashboard" routerLinkActive="bg-blue-50 text-blue-600 shadow-sm"
            (click)="onNavLinkClick()"
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <mat-icon class="text-slate-400 group-hover:text-blue-500">dashboard</mat-icon>
            <span class="font-medium">Dashboard</span>
          </a>
    
          <div class="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Procurement
          </div>
    
          <a routerLink="/purchase-orders" routerLinkActive="bg-blue-50 text-blue-600 shadow-sm"
            (click)="onNavLinkClick()"
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <mat-icon class="text-slate-400 group-hover:text-blue-500">description</mat-icon>
            <span class="font-medium">Purchase Orders</span>
          </a>
    
          <a routerLink="/suppliers" routerLinkActive="bg-blue-50 text-blue-600 shadow-sm"
            (click)="onNavLinkClick()"
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <mat-icon class="text-slate-400 group-hover:text-blue-500">business</mat-icon>
            <span class="font-medium">Suppliers</span>
          </a>
    
          <div class="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>
    
          <a routerLink="/settings" routerLinkActive="bg-blue-50 text-blue-600 shadow-sm"
            (click)="onNavLinkClick()"
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-all group">
            <mat-icon class="text-slate-400 group-hover:text-blue-500">settings</mat-icon>
            <span class="font-medium">Settings</span>
          </a>
        </nav>
    
        <!-- Profile / Footer -->
        <div class="p-4 border-t border-slate-200">
          <div [matMenuTriggerFor]="profileMenu" class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {{ (user()?.name || 'U').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-slate-800 truncate">{{ user()?.name }}</p>
              <p class="text-xs text-slate-500 truncate">{{ user()?.email }}</p>
            </div>
            <mat-icon class="text-slate-400 text-sm">unfold_more</mat-icon>
          </div>
    
          <mat-menu #profileMenu="matMenu" class="rounded-2xl border border-slate-100 shadow-xl">
            <button mat-menu-item (click)="logout()" class="text-red-600 font-medium">
              <mat-icon class="text-red-500">logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </aside>
    
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Topbar -->
        <header class="h-16 bg-white gap-4 border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10">
          <div class="flex items-center gap-3 flex-1">
            <button (click)="toggleSidebar()" class="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="relative w-full max-w-xs hidden sm:block md:max-w-md">
              <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</mat-icon>
              <input type="text" placeholder="Search..."
                class="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none">
            </div>
          </div>
    
          <div class="flex items-center gap-2">
            <button mat-flat-button color="primary" routerLink="/purchase-orders/create"
              class="rounded-xl px-4 py-2 font-bold shadow-sm shadow-blue-200 flex items-center">
              <mat-icon class="sm:mr-1">add</mat-icon>
              <span class="hidden xs:inline">Create New</span>
              <span class="hidden sm:inline ml-1">PO</span>
            </button>
          </div>
        </header>
    
        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-slate-50">
          <div class="mx-auto w-full">
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
    
    .mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 400px) {
      .xs\\:inline { display: inline; }
      .xs\\:hidden { display: none; }
    }
  `]
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  user = this.authService.currentUser;
  isSidebarOpen = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  onNavLinkClick() {
    if (window.innerWidth < 768) {
      this.isSidebarOpen.set(false);
    }
  }

  logout() {
    this.authService.logout();
  }
}
