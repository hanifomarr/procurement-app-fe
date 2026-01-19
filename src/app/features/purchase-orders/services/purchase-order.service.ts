import { Injectable, signal } from '@angular/core';
import { PurchaseOrder, POStatus } from '../../../core/models/purchase-order.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private mockOrders = signal<PurchaseOrder[]>([
    {
      id: 1,
      poNumber: 'PO-2024-001',
      status: POStatus.SUBMITTED,
      totalAmount: 1200.50,
      supplierId: 1,
      supplierName: 'Global Tech Solutions',
      createdBy: 1,
      createdByName: 'John Doe',
      items: [
        { productName: 'Laptops', quantity: 1, unitPrice: 1000.00, lineTotal: 1000.00 },
        { productName: 'Accessories', quantity: 2, unitPrice: 100.25, lineTotal: 200.50 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      poNumber: 'PO-2024-002',
      status: POStatus.DRAFT,
      totalAmount: 450.00,
      supplierId: 2,
      supplierName: 'Office Pro Supplies',
      createdBy: 1,
      createdByName: 'John Doe',
      items: [
        { productName: 'Office Chairs', quantity: 3, unitPrice: 150.00, lineTotal: 450.00 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  getPurchaseOrders(): Observable<PurchaseOrder[]> {
    return of(this.mockOrders()).pipe(delay(500));
  }

  getPurchaseOrderById(id: number): Observable<PurchaseOrder | undefined> {
    const order = this.mockOrders().find(o => o.id === id);
    return of(order).pipe(delay(300));
  }

  createPurchaseOrder(order: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>): Observable<PurchaseOrder> {
    const id = Math.max(...this.mockOrders().map(o => o.id), 0) + 1;
    const poNumber = `PO-2024-${id.toString().padStart(3, '0')}`;
    const newOrder: PurchaseOrder = {
      ...order,
      id,
      poNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.mockOrders.update(orders => [newOrder, ...orders]);
    return of(newOrder).pipe(delay(500));
  }

  updateStatus(id: number, status: POStatus): Observable<PurchaseOrder | undefined> {
    let updatedOrder: PurchaseOrder | undefined;
    this.mockOrders.update(orders => orders.map(o => {
      if (o.id === id) {
        updatedOrder = { ...o, status, updatedAt: new Date().toISOString() };
        return updatedOrder;
      }
      return o;
    }));
    return of(updatedOrder).pipe(delay(300));
  }
}
