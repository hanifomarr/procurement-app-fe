export enum POStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export interface PurchaseOrderItem {
  id?: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  status: POStatus;
  totalAmount: number;
  supplierId: number;
  supplierName?: string;
  createdBy: number;
  createdByName?: string;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}
