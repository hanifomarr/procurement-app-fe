import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { SupplierService } from '../../suppliers/services/supplier.service';
import { Supplier } from '../../../core/models/supplier.model';
import { POStatus, PurchaseOrder } from '../../../core/models/purchase-order.model';

@Component({
  selector: 'app-po-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="p-3 sm:p-6 max-w-5xl mx-auto font-sans">
      <header class="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
        <button mat-icon-button routerLink="/purchase-orders" class="text-slate-500">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {{ isEditMode() ? 'Edit PO' : 'New PO' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500">Manage your procurement order details.</p>
        </div>
      </header>
 
      <form [formGroup]="poForm" (ngSubmit)="onSubmit()" class="space-y-6 sm:space-y-8">
        <!-- Main Details Card -->
        <mat-card class="p-4 sm:p-8 border-none shadow-sm rounded-2xl sm:rounded-3xl bg-white">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-700 ml-1">Supplier</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-icon matPrefix class="text-slate-400 mr-2">business</mat-icon>
                <mat-select formControlName="supplierId" placeholder="Select vendor">
                  <mat-option *ngFor="let supplier of suppliers()" [value]="supplier.id">
                    {{ supplier.name }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="poForm.get('supplierId')?.hasError('required')">Required</mat-error>
              </mat-form-field>
            </div>
 
            <div class="space-y-1">
              <label class="text-sm font-semibold text-slate-700 ml-1">Status</label>
              <mat-form-field appearance="outline" class="w-full">
                <mat-icon matPrefix class="text-slate-400 mr-2">flag</mat-icon>
                <mat-select formControlName="status">
                  <mat-option [value]="POStatus.DRAFT">Draft</mat-option>
                  <mat-option [value]="POStatus.SUBMITTED">Submitted</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </mat-card>
 
        <!-- Items Card -->
        <mat-card class="p-4 sm:p-8 border-none shadow-sm rounded-2xl sm:rounded-3xl bg-white">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 class="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <mat-icon class="text-blue-500">list_alt</mat-icon>
              Order Items
            </h2>
            <button type="button" mat-stroked-button color="primary" (click)="addItem()" 
                    class="w-full sm:w-auto rounded-xl font-bold border-2">
              <mat-icon class="mr-1">add</mat-icon>
              Add Item
            </button>
          </div>
 
          <div formArrayName="items" class="space-y-4">
            <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i" 
                 class="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end bg-slate-50/50 p-4 sm:p-6 rounded-2xl border border-slate-100">
              
              <div class="md:col-span-5 space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Product Name</label>
                <mat-form-field appearance="outline" class="w-full dense-field">
                  <input matInput formControlName="productName" placeholder="What are you buying?">
                </mat-form-field>
              </div>
 
              <div class="flex gap-3 md:col-span-4">
                <div class="flex-1 space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Qty</label>
                  <mat-form-field appearance="outline" class="w-full dense-field">
                    <input matInput type="number" formControlName="quantity" min="1" (change)="calculateTotal()">
                  </mat-form-field>
                </div>
 
                <div class="flex-[2] space-y-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Price</label>
                  <mat-form-field appearance="outline" class="w-full dense-field">
                    <span matPrefix class="text-slate-400 mr-1 text-xs">RM</span>
                    <input matInput type="number" formControlName="unitPrice" min="0" step="0.01" (change)="calculateTotal()">
                  </mat-form-field>
                </div>
              </div>
 
              <div class="md:col-span-2 space-y-1">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 md:text-right block md:pr-2">Subtotal</label>
                <div class="h-[48px] flex items-center md:justify-end font-bold text-slate-700 md:pr-2">
                  {{ (item.get('lineTotal')?.value || 0) | currency:'RM':'symbol':'1.2-2' }}
                </div>
              </div>
 
              <div class="md:col-span-1 flex justify-end">
                <button type="button" mat-icon-button color="warn" (click)="removeItem(i)" 
                        [disabled]="items.length === 1" class="mb-1">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </div>
            </div>

            <div *ngIf="items.length === 0" class="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <mat-icon class="text-slate-300 text-4xl mb-2">inventory_2</mat-icon>
              <p class="text-slate-500">No items added. Click "Add Item" to start.</p>
            </div>
          </div>
 
          <div class="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <div class="text-right">
              <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Amount</p>
              <h3 class="text-3xl sm:text-4xl font-black text-slate-900 line-clamp-1">{{ poForm.get('totalAmount')?.value | currency:'RM':'symbol':'1.2-2' }}</h3>
            </div>
          </div>
        </mat-card>

        <!-- Actions -->
        <div class="flex justify-end gap-4 mt-8">
          <button mat-button type="button" routerLink="/purchase-orders" class="px-8 py-6 rounded-2xl font-bold min-w-[140px]">
            Cancel
          </button>
          <button mat-flat-button color="primary" type="submit" [disabled]="poForm.invalid || isLoading()"
                  class="px-10 py-6 rounded-2xl font-bold shadow-xl shadow-blue-200 min-w-[180px]">
            <span *ngIf="!isLoading()">{{ isEditMode() ? 'Update Order' : 'Create Order' }}</span>
            <div *ngIf="isLoading()" class="flex items-center gap-2">
              <mat-icon class="animate-spin">refresh</mat-icon>
              Saving...
            </div>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .mat-mdc-text-field-wrapper { background-color: #f8fafc !important; border-radius: 12px !important; }
    .dense-field { margin-bottom: 0px !important; }
  `]
})
export class POFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private poService = inject(PurchaseOrderService);
  private supplierService = inject(SupplierService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  POStatus = POStatus;
  suppliers = signal<Supplier[]>([]);
  isEditMode = signal(false);
  isLoading = signal(false);
  orderId: any = null;

  poForm: FormGroup = this.fb.group({
    supplierId: ['', [Validators.required]],
    status: [POStatus.DRAFT, [Validators.required]],
    totalAmount: [0, [Validators.required]],
    items: this.fb.array([])
  });

  get items() {
    return this.poForm.get('items') as FormArray;
  }

  ngOnInit() {
    this.loadSuppliers();
    this.checkEditMode();
    if (!this.isEditMode()) {
      this.addItem(); // Start with one item
    }
  }

  private loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(data => this.suppliers.set(data));
  }

  private checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route ID param:', id);
    if (id && id !== 'NaN' && id !== 'undefined') {
      this.isEditMode.set(true);
      this.orderId = id;
      this.loadOrder(this.orderId);
    }
  }

  private loadOrder(id: any) {
    this.isLoading.set(true);
    this.poService.getPurchaseOrderById(id).subscribe({
      next: (order) => {
        console.log('Loading order into form:', order);
        this.poForm.patchValue({
          supplierId: order.supplierId,
          status: order.status,
          totalAmount: order.totalAmount
        });
        
        // Clear items to avoid duplicates
        while (this.items.length !== 0) {
          this.items.removeAt(0);
        }
        
        order.items.forEach(item => {
          this.items.push(this.fb.group({
            productName: [item.productName, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]],
            lineTotal: [item.lineTotal]
          }));
        });
        this.isLoading.set(false);
      },
      error: () => this.showError('Failed to load order')
    });
  }

  addItem() {
    const itemForm = this.fb.group({
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      lineTotal: [0]
    });
    this.items.push(itemForm);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotal();
  }

  calculateTotal() {
    let total = 0;
    this.items.controls.forEach(control => {
      const g = control as FormGroup;
      const subtotal = (g.get('quantity')?.value || 0) * (g.get('unitPrice')?.value || 0);
      g.get('lineTotal')?.setValue(subtotal, { emitEvent: false });
      total += subtotal;
    });
    this.poForm.get('totalAmount')?.setValue(total);
  }

  onSubmit() {
    if (this.poForm.valid) {
      this.isLoading.set(true);
      const data = this.poForm.value;
      
      const request = this.isEditMode() 
        ? this.poService.updatePurchaseOrder(this.orderId!, data)
        : this.poService.createPurchaseOrder(data);

      request.subscribe({
        next: () => {
          this.showSuccess(`Purchase order ${this.isEditMode() ? 'updated' : 'created'} successfully`);
          this.router.navigate(['/purchase-orders']);
        },
        error: () => {
          this.isLoading.set(false);
          this.showError('Failed to save purchase order');
        }
      });
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}
