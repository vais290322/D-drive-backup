import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/admin/components/ui/Dialog";
import { Button } from "@/admin/components/ui/Button";
import { Badge } from "@/admin/components/ui/Badge";
import { Card } from "@/admin/components/ui/Card";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center w-full">
            <DialogTitle>
              Order Details #{order._id?.slice(-6).toUpperCase()}
            </DialogTitle>
            <Badge
              variant={
                order.orderStatus === "Delivered" ? "success" : "secondary"
              }
            >
              {order.orderStatus}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Customer Information
            </h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-medium text-gray-900">
                  {order.user?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">
                  {order.user?.email || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900">
                  {order.user?.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Shipping Address
            </h3>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{order.address}</p>
              {order.street && <p>{order.street}</p>}
              <p>
                {order.city}
                {order.postalCode && `, ${order.postalCode}`}
              </p>
              <p>{order.state}</p>
              {order.landmark && (
                <p className="text-gray-500 text-xs mt-1">
                  Landmark: {order.landmark}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Order Items ({order.orderItems?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Code: {item.productCode}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Qty: {item.Quantity}</p>
                    <p className="font-medium">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">
              Payment Summary
            </h3>
            <div className="bg-emerald-50/50 p-4 rounded-lg flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>
                  ₹
                  {order.totalPrice -
                    (order.shippingPrice || 0) +
                    (order.discount || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>₹{order.shippingPrice || 0}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>-₹{order.discount || 0}</span>
              </div>
              <div className="border-t border-emerald-200 pt-2 mt-2 flex justify-between font-bold text-lg text-emerald-900">
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onClose(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;