const express = require("express");
const { createOrderService } = require("./orderService");

const app = express();
const orderService = createOrderService();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Fictional Order Management API is running." });
});

app.post("/orders", (req, res) => {
  try {
    const order = orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/orders", (req, res) => {
  res.json(orderService.listOrders());
});

app.get("/orders/:id", (req, res) => {
  try {
    res.json(orderService.getOrder(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.patch("/orders/:id/status", (req, res) => {
  try {
    const order = orderService.updateStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (error) {
    const statusCode = error.message === "Order not found." ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

app.post("/orders/:id/assign", (req, res) => {
  try {
    const order = orderService.assignDriver(req.params.id, req.body.driverId);
    res.json(order);
  } catch (error) {
    const statusCode = error.message === "Order not found." ? 404 : 400;
    res.status(statusCode).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
