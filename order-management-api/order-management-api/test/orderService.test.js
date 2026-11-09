const test = require("node:test");
const assert = require("node:assert/strict");
const { createOrderService } = require("../src/orderService");

test("creates an order and moves it through the valid workflow", () => {
  const service = createOrderService();

  const order = service.createOrder({
    customerName: "Alex Morgan",
    items: ["Sandwich", "Iced tea"]
  });

  assert.equal(order.status, "placed");
  assert.equal(order.driverId, null);

  service.updateStatus(order.id, "accepted");
  service.assignDriver(order.id, "driver-101");
  service.updateStatus(order.id, "picked_up");
  service.updateStatus(order.id, "delivered");

  assert.equal(service.getOrder(order.id).status, "delivered");
});

test("rejects an invalid status transition", () => {
  const service = createOrderService();
  const order = service.createOrder({
    customerName: "Jamie Lee",
    items: ["Salad"]
  });

  assert.throws(
    () => service.updateStatus(order.id, "delivered"),
    /Invalid transition/
  );
  assert.equal(service.getOrder(order.id).status, "placed");
});

test("prevents assigning a second driver to the same order", () => {
  const service = createOrderService();
  const order = service.createOrder({
    customerName: "Taylor Reed",
    items: ["Soup"]
  });

  service.updateStatus(order.id, "accepted");
  service.assignDriver(order.id, "driver-201");

  assert.throws(
    () => service.assignDriver(order.id, "driver-202"),
    /already has a driver/
  );
  assert.equal(service.getOrder(order.id).driverId, "driver-201");
});

test("prevents one driver from taking two active orders", () => {
  const service = createOrderService();
  const first = service.createOrder({ customerName: "A", items: ["Item A"] });
  const second = service.createOrder({ customerName: "B", items: ["Item B"] });

  service.updateStatus(first.id, "accepted");
  service.assignDriver(first.id, "driver-301");
  service.updateStatus(second.id, "accepted");

  assert.throws(
    () => service.assignDriver(second.id, "driver-301"),
    /already assigned to another active order/
  );
});
