const VALID_STATUSES = ["placed", "accepted", "assigned", "picked_up", "delivered"];

const NEXT_STATUS = {
  placed: "accepted",
  accepted: "assigned",
  assigned: "picked_up",
  picked_up: "delivered"
};

function createOrderService() {
  const orders = [];
  let nextOrderId = 1;

  function createOrder({ customerName, items }) {
    if (typeof customerName !== "string" || customerName.trim() === "") {
      throw new Error("customerName is required.");
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("At least one item is required.");
    }

    const order = {
      id: nextOrderId++,
      customerName: customerName.trim(),
      items: [...items],
      status: "placed",
      driverId: null
    };

    orders.push(order);
    return order;
  }

  function getOrder(orderId) {
    const order = orders.find((item) => item.id === Number(orderId));
    if (!order) throw new Error("Order not found.");
    return order;
  }

  function listOrders() {
    return orders;
  }

  function updateStatus(orderId, newStatus) {
    const order = getOrder(orderId);

    if (!VALID_STATUSES.includes(newStatus)) {
      throw new Error("Invalid status.");
    }

    const expectedStatus = NEXT_STATUS[order.status];
    if (newStatus !== expectedStatus) {
      throw new Error(
        `Invalid transition: ${order.status} cannot move to ${newStatus}.`
      );
    }

    if (newStatus === "assigned" && !order.driverId) {
      throw new Error("Assign a driver before moving the order to assigned.");
    }

    order.status = newStatus;
    return order;
  }

  function assignDriver(orderId, driverId) {
    const order = getOrder(orderId);

    if (order.driverId !== null) {
      throw new Error("This order already has a driver assigned.");
    }
    if (order.status !== "accepted") {
      throw new Error("A driver can only be assigned to an accepted order.");
    }
    if (typeof driverId !== "string" || driverId.trim() === "") {
      throw new Error("A valid driverId is required.");
    }

    const driverHasActiveOrder = orders.some(
      (otherOrder) =>
        otherOrder.id !== order.id &&
        otherOrder.driverId === driverId.trim() &&
        otherOrder.status !== "delivered"
    );

    if (driverHasActiveOrder) {
      throw new Error("This driver is already assigned to another active order.");
    }

    order.driverId = driverId.trim();
    order.status = "assigned";
    return order;
  }

  return { createOrder, getOrder, listOrders, updateStatus, assignDriver };
}

module.exports = { createOrderService, VALID_STATUSES };
