import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrder, POStatus } from '../../../core/models/purchase-order.model';
import { SupplierService } from '../../suppliers/services/supplier.service';
import { Supplier } from '../../../core/models/supplier.model';

@Component({
  selector: 'app-po-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="p-4 sm:p-8 max-w-5xl mx-auto font-sans print:p-0">
      <!-- Actions Bar -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 print:hidden">
        <div class="flex items-center gap-4">
          <button mat-icon-button routerLink="/purchase-orders" class="text-slate-500 hover:bg-slate-100 transition-colors">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              {{ po()?.poNumber || 'Loading...' }}
              <span [ngClass]="{
                'bg-amber-100 text-amber-700': po()?.status === POStatus.DRAFT,
                'bg-blue-100 text-blue-700': po()?.status === POStatus.SUBMITTED
              }" class="text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-black border border-white/50">
                {{ po()?.status }}
              </span>
            </h1>
            <p class="text-slate-500 text-sm font-medium">Order details and itemization</p>
          </div>
        </div>
    
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button mat-stroked-button (click)="printPage()" class="flex-1 sm:flex-none py-6 rounded-xl font-bold border-2 text-slate-600">
            <mat-icon class="mr-2">print</mat-icon>
            Print PDF
          </button>
          <button mat-flat-button color="primary" [routerLink]="['/purchase-orders/edit', po()?.id]"
            class="flex-1 sm:flex-none py-6 rounded-xl font-bold shadow-xl shadow-blue-100">
            <mat-icon class="mr-2">edit</mat-icon>
            Edit Order
          </button>
        </div>
      </header>
    
      <!-- Document Content -->
      <mat-card class="bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden print:shadow-none print:rounded-none">
        <!-- Document Header Stripes -->
        <div class="h-3 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"></div>
    
        <div class="p-8 sm:p-12">
          <!-- Logo & Company -->
          <div class="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                <mat-icon class="scale-150">shopping_basket</mat-icon>
              </div>
              <div>
                <h2 class="text-2xl font-black text-slate-900 tracking-tighter">Neurogine</h2>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Procurement System</p>
              </div>
            </div>
    
            <div class="text-left md:text-right space-y-1">
              <h3 class="text-xl font-black text-slate-900">PURCHASE ORDER</h3>
              <p class="text-slate-500 font-bold tracking-tight">PO #: {{ po()?.poNumber }}</p>
              <p class="text-slate-500 font-medium">Date: {{ po()?.createdAt | date:'fullDate' }}</p>
            </div>
          </div>
    
          <mat-divider class="mb-12 opacity-50"></mat-divider>
    
          <!-- Billing/Supplier Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vendor Details</p>
              <div class="space-y-2">
                <h4 class="text-xl font-black text-slate-900">{{ po()?.supplierName }}</h4>
                <div class="flex items-center gap-2 text-slate-600 font-medium">
                  <mat-icon class="text-sm scale-75">location_on</mat-icon>
                  <p>{{ supplier()?.address || 'N/A' }}</p>
                </div>
                <div class="flex items-center gap-2 text-slate-600 font-medium">
                  <mat-icon class="text-sm scale-75">email</mat-icon>
                  <p>{{ supplier()?.contactEmail || 'N/A' }}</p>
                </div>
                <div class="flex items-center gap-2 text-slate-600 font-medium">
                  <mat-icon class="text-sm scale-75">phone</mat-icon>
                  <p>{{ supplier()?.phone || 'N/A' }}</p>
                </div>
              </div>
            </div>
    
            <div class="md:text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Internal Info</p>
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-bold text-slate-500">Order Status</p>
                  <p class="text-lg font-black text-slate-900">{{ po()?.status }}</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-500">Authorized By</p>
                  <p class="text-lg font-black text-slate-900">System Admin</p>
                </div>
              </div>
            </div>
          </div>
    
          <!-- Items Table -->
          <div class="mb-12 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/80">
                  <th class="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-wider">Product / Service</th>
                  <th class="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Qty</th>
                  <th class="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
                  <th class="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (item of po()?.items; track item) {
                  <tr class="hover:bg-slate-50/30 transition-colors">
                    <td class="py-5 px-6 font-bold text-slate-800">{{ item.productName }}</td>
                    <td class="py-5 px-6 text-center font-bold text-slate-600 bg-slate-50/20">{{ item.quantity }}</td>
                    <td class="py-5 px-6 text-right font-medium text-slate-600">{{ item.unitPrice | currency:'RM':'symbol':'1.2-2' }}</td>
                    <td class="py-5 px-6 text-right font-black text-slate-900">{{ item.lineTotal | currency:'RM':'symbol':'1.2-2' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
    
          <!-- Totals -->
          <div class="flex flex-col items-end gap-3 px-6">
            <div class="flex justify-between w-full max-w-[280px]">
              <span class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Net Total</span>
              <span class="text-slate-800 font-bold">{{ (po()?.totalAmount || 0) | currency:'RM':'symbol':'1.2-2' }}</span>
            </div>
            <div class="flex justify-between w-full max-w-[280px]">
              <span class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tax (0%)</span>
              <span class="text-slate-800 font-bold">RM 0.00</span>
            </div>
            <mat-divider class="w-full max-w-[280px] my-2"></mat-divider>
            <div class="flex justify-between w-full max-w-[280px]">
              <span class="text-slate-900 font-black uppercase tracking-widest text-xs">Total Amount</span>
              <span class="text-3xl font-black text-blue-600">{{ po()?.totalAmount | currency:'RM':'symbol':'1.2-2' }}</span>
            </div>
          </div>
    
          <!-- Footer/Notes -->
          <div class="mt-20 border-t-2 border-dashed border-slate-100 pt-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h5 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Notes & Instructions</h5>
                <p class="text-slate-500 text-sm leading-relaxed">
                  Please include the Purchase Order number on all invoices and shipping documents.
                  Goods are subject to inspection upon delivery. Payment terms: Net 30 days.
                </p>
              </div>
              <div class="flex flex-col items-start md:items-end justify-end">
                <div class="w-full max-w-[200px] border-b-2 border-slate-900 mb-2"></div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </mat-card>
    
      <div class="mt-8 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest print:hidden">
        This is a computer generated document. No signature required.
      </div>
    </div>
    `,
  styles: [`
    :host {
      display: block;
      background-color: #f8fafc;
      min-height: 100vh;
    }
    
    .mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media print {
      :host {
        background-color: white !important;
      }
      mat-card {
        padding: 0 !important;
      }
    }
  `]
})
export class PODetailComponent implements OnInit {
  private poService = inject(PurchaseOrderService);
  private supplierService = inject(SupplierService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  po = signal<PurchaseOrder | null>(null);
  supplier = signal<Supplier | null>(null);
  POStatus = POStatus;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPODetails(id);
    }
  }

  loadPODetails(id: string) {
    this.poService.getPurchaseOrderById(id).subscribe({
      next: (data) => {
        this.po.set(data);
        if (data.supplierId) {
          this.loadSupplierDetails(data.supplierId);
        }
      },
      error: () => this.router.navigate(['/purchase-orders'])
    });
  }

  loadSupplierDetails(supplierId: any) {
    this.supplierService.getSuppliers().subscribe(suppliers => {
      const match = suppliers.find(s => String(s.id) === String(supplierId));
      if (match) {
        this.supplier.set(match);
      }
    });
  }

  printPage() {
    window.print();
  }
}
