/**
 * Helper functions for order actions (Cancel & Return)
 * Following standard eCommerce business rules.
 */

export const ORDER_STATUS = {
  PLACED: "PLACED",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURN_REQUESTED: "RETURN_REQUESTED",
  RETURN_APPROVED: "RETURN_APPROVED",
  RETURN_COMPLETED: "RETURN_COMPLETED",
};

/**
 * Calculates days since the order was delivered.
 * @param {Object} order
 * @returns {number}
 */
export const getDaysSinceDelivery = (order) => {
  if (!order || order.status !== ORDER_STATUS.DELIVERED) return 0;

  const deliveredAtDate = order.deliveredAt || order.deliveredDate;
  if (!deliveredAtDate) return 0;

  const deliveredAt = new Date(deliveredAtDate);
  const today = new Date();

  // Reset hours to compare only dates
  const d1 = new Date(
    deliveredAt.getFullYear(),
    deliveredAt.getMonth(),
    deliveredAt.getDate()
  );
  const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diffMs = d2 - d1;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Business rule: Cancel is allowed ONLY when status is PLACED or CONFIRMED.
 * @param {Object} order
 * @returns {boolean}
 */
export const canCancelOrder = (order) => {
  if (!order) return false;
  return (
    order.status === ORDER_STATUS.PLACED ||
    order.status === ORDER_STATUS.CONFIRMED
  );
};

/**
 * Business rule: Return is allowed ONLY when status is DELIVERED and within 7 days.
 * @param {Object} order
 * @returns {boolean}
 */
export const canReturnOrder = (order) => {
  if (!order || order.status !== ORDER_STATUS.DELIVERED) return false;

  const daysSinceDelivery = getDaysSinceDelivery(order);
  return daysSinceDelivery <= 7;
};
