# Order Management System

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-86%20passing-brightgreen)
![Deploy](https://img.shields.io/badge/Deployed-Live-success)

A full-stack food delivery order management system with real-time order tracking via WebSocket.

**Live Demo:** [Frontend](https://raftlabs-order-management.vercel.app) | [Backend API](https://raftlabs-order-management.onrender.com/api/menu)

---

## Features

- [x] Menu display with category badges and responsive grid
- [x] Add to cart with quantity controls and visual feedback
- [x] Cart persistence across page refreshes (localStorage)
- [x] Checkout with client-side validation (name, address, phone)
- [x] Real-time order tracking via WebSocket
- [x] Auto-progressing order status (received -> preparing -> out for delivery -> delivered)
- [x] Responsive mobile-first design
- [x] Comprehensive test coverage (86 tests)

---

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui |
| Backend    | Express, TypeScript, Zod, nanoid                |
| Real-time  | WebSocket (`ws` library)                        |
| Testing    | Vitest, React Testing Library, Supertest        |
| Deployment | Vercel (frontend), Render (backend)             |

---

## Architecture

```
+---------------------+         +-------------------------------------+
|      FRONTEND       |         |             BACKEND                 |
|    (Next.js 16)     |         |     (Express + TypeScript)          |
|                     |         |                                     |
|  Menu Page          |  HTTP   |  Routes -> Controllers -> Services  |
|  Cart (Context)     |-------->|              |                      |
|  Checkout Form      |         |         In-Memory Store             |
|  Order Tracking     |<------->|              |                      |
|                     |   WS    |    WebSocket + Status Simulator     |
+---------------------+         +-------------------------------------+
```

**Backend** uses a layered architecture where each layer has a single responsibility:

- **Routes** --Define endpoints, map to controllers
- **Controllers** --Handle HTTP req/res (synchronous, no async/await)
- **Services** --Business logic: price calculation, order creation, status management
- **Store** --In-memory `Map<string, T>` data access (swappable for a real DB)

**Frontend** state management:

- **Cart** --React Context + localStorage. Ephemeral session data, no server persistence needed.
- **Order Tracking** --WebSocket hook (`useOrderStatus`) with auto-reconnection for real-time status updates.

---

## API Endpoints

| Method  | Endpoint                                       | Description              |
| ------- | ---------------------------------------------- | ------------------------ |
| `GET`   | `/api/menu`                                    | Get all menu items       |
| `GET`   | `/api/menu/:id`                                | Get single menu item     |
| `POST`  | `/api/orders`                                  | Create a new order       |
| `GET`   | `/api/orders/:id`                              | Get order by ID          |
| `PATCH` | `/api/orders/:id/status`                       | Update order status      |
| `WS`    | `wss://raftlabs-order-management.onrender.com` | Real-time status updates |

### Example: Create Order

**Request:**

```json
POST /api/orders
{
  "items": [
    { "menuItemId": "pizza-1", "quantity": 2 },
    { "menuItemId": "drink-1", "quantity": 1 }
  ],
  "customer": {
    "name": "John Doe",
    "address": "123 Main Street, Pune",
    "phone": "9876543210"
  }
}
```

**Response:**

```json
{
  "id": "V1StGXR8_Z5jdHi6B-myT",
  "items": [
    { "menuItemId": "pizza-1", "quantity": 2 },
    { "menuItemId": "drink-1", "quantity": 1 }
  ],
  "customer": {
    "name": "John Doe",
    "address": "123 Main Street, Pune",
    "phone": "9876543210"
  },
  "status": "received",
  "totalAmount": 30.47,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

### WebSocket Message Format

```json
{
  "type": "ORDER_STATUS_UPDATE",
  "orderId": "V1StGXR8_Z5jdHi6B-myT",
  "status": "preparing",
  "updatedAt": "2025-01-15T10:30:10.000Z"
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev        # Dev server with hot reload on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # Dev server on http://localhost:3000
```

Create `frontend/.env.local` for local development:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

---

## Running Tests

```bash
# Backend (23 tests)
cd backend
npm test

# Frontend (63 tests)
cd frontend
npm test
```

All 86 tests should pass.

---

## Project Structure

```
raftlabs-order-management/
|-- backend/
|   |-- src/
|   |   |-- controllers/       # HTTP request handlers
|   |   |-- routes/            # Express route definitions
|   |   |-- services/          # Business logic
|   |   |-- store/             # In-memory data store
|   |   |-- types/             # TypeScript interfaces
|   |   |-- validators/        # Zod schemas
|   |   |-- websocket/         # WebSocket server + broadcast
|   |   |-- utils/             # Status simulator
|   |   |-- app.ts             # Express app config
|   |   +-- index.ts           # Entry point
|   +-- tests/                 # Backend tests (Vitest + Supertest)
|
|-- frontend/
|   |-- src/
|   |   |-- app/               # Next.js pages (/, /cart, /checkout, /order/[id])
|   |   |-- components/        # UI components (menu, cart, checkout, order)
|   |   |-- hooks/             # useCart, useOrderStatus, CartProvider
|   |   |-- lib/               # API client, utils
|   |   +-- types/             # TypeScript interfaces
|   +-- tests/                 # Frontend tests (Vitest + RTL)
|
+-- README.md
```

---

## Key Design Decisions

- **In-memory store** --Keeps the demo simple. The store interface (`getAll`, `getById`, `create`, `update`) can be swapped for Postgres/Mongo without changing layers above it.
- **Client-side cart** --Cart is ephemeral, session-scoped data. localStorage persistence is sufficient; no server round-trips needed for add/remove operations.
- **WebSocket over polling** --True real-time updates with lower overhead. The status simulator broadcasts every 10 seconds, and all connected clients receive updates instantly.
- **Layered backend** --Controllers don't contain business logic, services don't touch HTTP objects. Each layer is independently testable.
- **Synchronous controllers** --No database I/O means no async/await needed. Simpler code, easier to reason about.

---

## Author

**Swayam Yadav** --[GitHub](https://github.com/swayamyadav05)
