# Fictional Order Management API

## Overview
A small Node.js and Express API that manages fictional customer orders in memory. It demonstrates order creation, controlled status transitions, driver assignment, validation, and automated tests.

No real customer information or live company systems are used. Data is stored in a JavaScript array and resets when the server restarts.




## Run tests



The tests cover:
- A successful order workflow.
- Rejection of an invalid status transition.
- Prevention of a second driver being assigned to the same order.
- Prevention of one driver being assigned to two active orders.

## API endpoints

### Create an order
`POST /orders`

Example JSON body:

```json
{
  "customerName": "Alex Morgan",
  "items": ["Sandwich", "Iced tea"]
}
```

A new order starts with status `placed`.

### List orders
`GET /orders`

### Get one order
`GET /orders/1`

### Accept an order
`PATCH /orders/1/status`

```json
{
  "status": "accepted"
}
```

### Assign a driver
`POST /orders/1/assign`

```json
{
  "driverId": "driver-101"
}
```

Assigning a driver changes the order status from `accepted` to `assigned`.

### Mark as picked up
`PATCH /orders/1/status`

```json
{
  "status": "picked_up"
}
```

### Mark as delivered
`PATCH /orders/1/status`

```json
{
  "status": "delivered"
}
```

## Business rules
- Orders must be created with a customer name and at least one item.
- The only allowed status sequence is `placed` → `accepted` → `assigned` → `picked_up` → `delivered`.
- A driver can only be assigned after an order is accepted.
- An order can have only one driver.
- A driver cannot be assigned to another active order.
- Delivered orders are final; they cannot move to another status.

## Design notes
The order rules are kept in `src/orderService.js`, separate from the Express routes in `src/server.js`. This makes the business logic easier to test without starting an HTTP server.

## AI-use disclosure
AI assistance (ChatGPT) was used to help interpret the assessment.