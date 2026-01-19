import { Injectable, signal } from '@angular/core';
import { Supplier } from '../../../core/models/supplier.model';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private mockSuppliers = signal<Supplier[]>([
    {
      id: 1,
      name: 'Global Tech Solutions',
      contactEmail: 'contact@globaltech.com',
      phone: '+1 234 567 890',
      address: '123 Tech Lane, Silicon Valley, CA'
    },
    {
      id: 2,
      name: 'Office Pro Supplies',
      contactEmail: 'sales@officepro.com',
      phone: '+1 987 654 321',
      address: '456 Business Row, Chicago, IL'
    },
    {
      id: 3,
      name: 'Eco-Friendly Packagings',
      contactEmail: 'info@ecopack.com',
      phone: '+44 20 1234 5678',
      address: '789 Green Way, London, UK'
    }
  ]);

  getSuppliers(): Observable<Supplier[]> {
    return of(this.mockSuppliers()).pipe(delay(500));
  }

  getSupplierById(id: number): Observable<Supplier | undefined> {
    const supplier = this.mockSuppliers().find(s => s.id === id);
    return of(supplier).pipe(delay(300));
  }

  addSupplier(supplier: Omit<Supplier, 'id'>): Observable<Supplier> {
    const newSupplier = { ...supplier, id: Math.max(...this.mockSuppliers().map(s => s.id), 0) + 1 };
    this.mockSuppliers.update(suppliers => [...suppliers, newSupplier]);
    return of(newSupplier).pipe(delay(500));
  }
}
