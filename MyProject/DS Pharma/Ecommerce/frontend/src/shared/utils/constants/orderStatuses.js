// Order Status Constants
// ============================================================
// Status values and configurations for orders

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out-for-delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  RETURNED: 'returned',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUSES.PENDING]: '#FCD34D',      // yellow
  [ORDER_STATUSES.CONFIRMED]: '#3B82F6',    // blue
  [ORDER_STATUSES.PROCESSING]: '#8B5CF6',   // purple
  [ORDER_STATUSES.SHIPPED]: '#06B6D4',      // cyan
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: '#EC4899', // pink
  [ORDER_STATUSES.DELIVERED]: '#10B981',    // green
  [ORDER_STATUSES.CANCELLED]: '#EF4444',    // red
  [ORDER_STATUSES.FAILED]: '#DC2626',       // red-dark
  [ORDER_STATUSES.RETURNED]: '#6366F1',     // indigo
};

export const ORDER_STATUS_BACKGROUNDS = {
  [ORDER_STATUSES.PENDING]: '#FEF3C7',
  [ORDER_STATUSES.CONFIRMED]: '#DBEAFE',
  [ORDER_STATUSES.PROCESSING]: '#EDE9FE',
  [ORDER_STATUSES.SHIPPED]: '#CFFAFE',
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: '#FCE7F3',
  [ORDER_STATUSES.DELIVERED]: '#D1FAE5',
  [ORDER_STATUSES.CANCELLED]: '#FEE2E2',
  [ORDER_STATUSES.FAILED]: '#FEE2E2',
  [ORDER_STATUSES.RETURNED]: '#E0E7FF',
};
