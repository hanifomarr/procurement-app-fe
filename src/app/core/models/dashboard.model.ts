export interface RecentPurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface SupplierStat {
  supplierName: string;
  totalOrders: number;
  totalSpent: number;
}

export interface DashboardStats {
  totalPurchaseOrders: number;
  pendingApprovals: number;
  totalSuppliers: number;
  totalSpent: number;
  recentPurchaseOrders: RecentPurchaseOrder[];
  supplierStats: SupplierStat[];
}
