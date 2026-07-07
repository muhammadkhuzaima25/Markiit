<p align="center">
  <img alt="Markiit — Smart Community Service & Local Marketplace Platform" src="./client/public/markiit logo.svg" width="120" style="border-radius: 16px;">
</p>

<h1 align="center">Markiit</h1>

<p align="center">
  <strong>Buy & Sell Locally. Book Services. Connect with Your Community. The All-in-One Marketplace Platform Built for Neighborhood Commerce</strong>
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-markiit.vercel.app-00C27A?style=for-the-badge&labelColor=080E0D" alt="Live Demo">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-00C27A?style=flat&logo=react&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=nodedotjs&labelColor=080E0D">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Express.js-4-000000?style=flat&logo=express&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwindcss&labelColor=080E0D">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat&logo=jsonwebtokens&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=flat&logo=socketdotio&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=flat&logo=leaflet&labelColor=080E0D">
  <img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat&logo=cloudinary&labelColor=080E0D">
</p>

<br>

---

<!-- SEO KEYWORDS -->
<!--
markiit, local marketplace, community services, buy sell locally, service booking platform, real-time chat, neighborhood marketplace, MERN stack project, full stack web application, local commerce platform, product listings, service providers, booking system, user reviews, star ratings, nearby map explorer, geolocation discovery, messaging app, notification system, admin dashboard, user dashboard, MongoDB Express React Node project, socket.io chat, leaflet maps, cloudinary image upload, JWT authentication, responsive UI, dark light mode, local business platform, community trading, service marketplace, product marketplace, booking management, real-time messaging, mongoose models, REST API, full stack developer, MERN stack developer Pakistan
-->

---

## 📌 Overview

**Markiit** is a full-stack MERN web application built to empower local communities by connecting people who want to buy and sell products, book services, and discover nearby offerings — all in one seamless platform. Instead of juggling multiple apps and scattered listings, Markiit brings neighborhood commerce into a single, intuitive marketplace.

Whether you're a homeowner looking for a plumber, a student selling textbooks, or a service provider showcasing your skills — Markiit provides the tools to list, discover, book, and communicate with confidence.

> Built to reflect how real local communities actually trade — products, services, and conversations — all in one place.

---

## ❗ Problem Statement

Local commerce today is fragmented across social media groups, classifieds sites, and word-of-mouth. Three core problems make it inefficient:

- **No unified local marketplace** — buying and selling happens across disconnected platforms with no trust layer
- **Service discovery is hard** — finding reliable local service providers (plumbers, tutors, cleaners) requires asking around or scrolling through unverified listings
- **Communication gaps** — buyers and sellers struggle to coordinate bookings, ask questions, and build trust without a proper messaging system

**How Markiit solves this:**
Markiit combines a product marketplace, service booking engine, real-time messaging, and a map-based nearby explorer into one platform. Users can browse listings with advanced filters, book services with date/time selection, chat in real-time, leave reviews, and discover what's available around them — all with verified user profiles and secure authentication.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🛒 **Product Marketplace** | Browse, search, filter, and list products with multi-image uploads to Cloudinary |
| 🛎️ **Service Booking** | Offer services, set availability, and accept booking requests with status tracking |
| 🗺️ **Nearby Map Explorer** | Discover products and services near you using Leaflet maps with geolocation |
| 💬 **Real-time Messaging** | Direct user-to-user chat via Socket.io with typing indicators and image sharing |
| ⭐ **Reviews & Ratings** | Star rating system (1–5) with written reviews tied to completed bookings/purchases |
| 🔔 **Notifications** | Real-time notifications for bookings, messages, reviews, and admin actions |
| ❤️ **Favorites** | Save favorite products and services for quick access later |
| 👤 **User Dashboard** | Manage listings, bookings, favorites, profile, and notifications in one place |
| 🔐 **JWT Authentication** | Secure register/login with bcrypt password hashing and refresh token rotation |
| 🛡️ **Admin Panel** | Hidden admin dashboard for user management, listing moderation, and reported content |
| 📱 **Responsive UI** | Clean, modern layout across desktop and mobile with collapsible navigation |
| 🌗 **Dark / Light Mode** | Fully themed interface with persistent preference saved to localStorage |

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite 5
- React Router DOM v7
- Axios with JWT interceptor & refresh token logic
- Tailwind CSS 4
- Socket.io-client (real-time chat)
- Leaflet + React-Leaflet (map explorer)
- React Icons (icon library)
- React Hot Toast (notifications)
- Recharts (dashboard data visualization)

**Backend**
- Node.js + Express 4
- MongoDB Atlas + Mongoose 8
- Socket.io (real-time messaging server)
- JWT (jsonwebtoken) + bcryptjs
- Multer + Multer-Storage-Cloudinary (image uploads)
- Express Rate Limit (API throttling)
- Cookie Parser + CORS

**Deployment**
- Vercel (serverless functions + static hosting)
- MongoDB Atlas (cloud database)
- Cloudinary (cloud media storage)

---

## 🧠 How It Works

### For Buyers
1. **Browse** — Search products and services with filters (category, price, rating, location)
2. **Discover** — Use the map explorer to find nearby listings
3. **Book** — Book services with date and time selection
4. **Chat** — Message sellers/providers in real-time
5. **Review** — Leave star ratings and reviews after transactions

### For Sellers & Service Providers
1. **List** — Create product or service listings with images and descriptions
2. **Manage** — Track bookings, accept/reject requests, update status
3. **Communicate** — Chat with customers in real-time
4. **Grow** — Build reputation through reviews and ratings

### For Admins
1. **Monitor** — View platform statistics and recent activity
2. **Moderate** — Approve/reject pending listings, manage reported content
3. **Manage Users** — Suspend or reactivate user accounts

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas free tier)
- Cloudinary account (for image uploads)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/markiit.git
cd markiit
```

### 2. Install dependencies
```bash
npm run install-all
```

Or install individually:
```bash
cd client && npm install
cd ../server && npm install
```

### 3. Environment Variables

**Server** — create `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

**Client** — create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Admin Account
```bash
cd server
npm run seed
```

This creates the admin user using credentials from `.env`.

### 5. Run Development Servers

From the project root:
```bash
npm run dev
```

This starts both client (port 5173) and server (port 5000) concurrently.

Or run them separately:
```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
markiit/
├── client/                        # React + Vite Frontend
│   ├── public/
│   │   └── markiit logo.svg       # Brand logo
│   └── src/
│       ├── components/
│       │   ├── common/            # Reusable UI (Cards, Modals, Loaders, Pagination)
│       │   └── layout/            # Navbar, Footer, AdminLayout, UserLayout
│       ├── context/
│       │   ├── AuthContext.jsx    # Auth state management
│       │   └── SocketContext.jsx  # Socket.io real-time connection
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── Auth/              # Login, Register, ForgotPassword
│       │   ├── Products/          # Product listings, create, detail
│       │   ├── Services/          # Service listings, create, detail
│       │   ├── Bookings/          # Booking history
│       │   ├── Messages/          # Chat, conversations, notifications
│       │   ├── Map/               # Nearby map explorer
│       │   ├── Admin/             # Admin dashboard, users, listings, reports
│       │   └── User/              # Dashboard, profile, favorites, settings
│       ├── services/
│       │   └── api.js             # Axios instance with JWT interceptor
│       ├── utils/
│       │   └── leafletIconFix.js  # Leaflet marker icon fix
│       └── assets/                # Images and static assets
│
├── server/                        # Node + Express Backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.js                # Register, login, refresh token, forgot password
│   │   ├── users.js               # Profile, nearby users, favorites
│   │   ├── products.js            # Product CRUD, search, filter, favorites
│   │   ├── services.js            # Service CRUD, search, filter, bookings
│   │   ├── bookings.js            # Booking creation, status updates
│   │   ├── reviews.js             # Review creation and retrieval
│   │   ├── messages.js            # Conversations and messages
│   │   ├── notifications.js       # Notification CRUD
│   │   ├── nearby.js              # Geo-based nearby listings
│   │   ├── reports.js             # Content reporting
│   │   └── admin.js               # Admin stats, user management, moderation
│   ├── middleware/
│   │   ├── auth.js                # JWT protect and authorize middleware
│   │   ├── upload.js              # Cloudinary multer storage config
│   │   ├── errorHandler.js        # Global error handling
│   │   └── validate.js            # Request validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── services.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   ├── messages.js
│   │   ├── notifications.js
│   │   ├── nearby.js
│   │   ├── reports.js
│   │   └── admin.js
│   ├── scripts/
│   │   ├── seedAdmin.js           # Seed default admin user
│   │   └── resetAdmin.js          # Reset admin credentials
│   ├── utils/
│   │   └── generateTokens.js      # Access + refresh token generation
│   ├── server.js                  # Express app + Socket.io + Vercel serverless
│   ├── vercel.json                # Vercel deployment config
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json                   # Root orchestration (concurrently)
```

---

## 🌐 API Endpoints

### Auth — `/api/auth`
| Method | Path | Description | Access |
|---|---|---|---|
| POST | /register | Register new user | Public |
| POST | /login | Login, returns JWT + refresh token | Public |
| POST | /logout | Logout, clear cookies | Private |
| GET | /me | Get current user profile | Private |
| POST | /refresh-token | Refresh access token | Public |
| POST | /forgot-password | Send password reset email | Public |
| PUT | /reset-password/:token | Reset password with token | Public |

### Users — `/api/users`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | /:id | Get user profile by ID | Private |
| PUT | /profile | Update own profile | Private |
| GET | /nearby | Get nearby users by location | Private |
| POST | /favorites/:id | Add to favorites | Private |
| GET | /favorites | Get favorite listings | Private |

### Products — `/api/products`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | / | List products (paginated, filterable) | Public |
| GET | /:id | Get single product | Public |
| POST | / | Create product listing | Private |
| PUT | /:id | Update product | Private |
| DELETE | /:id | Delete product | Private |
| POST | /:id/favorite | Toggle favorite | Private |
| GET | /favorites | Get favorite products | Private |
| GET | /my | Get my products | Private |

### Services — `/api/services`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | / | List services (paginated, filterable) | Public |
| GET | /:id | Get single service | Public |
| POST | / | Create service listing | Private |
| PUT | /:id | Update service | Private |
| DELETE | /:id | Delete service | Private |
| GET | /my | Get my services | Private |

### Bookings — `/api/bookings`
| Method | Path | Description | Access |
|---|---|---|---|
| POST | / | Create booking request | Private |
| GET | /my | Get my bookings (as customer) | Private |
| GET | /received | Get received bookings (as provider) | Private |
| GET | /:id | Get single booking | Private |
| PUT | /:id/status | Update booking status | Private |

### Reviews — `/api/reviews`
| Method | Path | Description | Access |
|---|---|---|---|
| POST | / | Create review | Private |
| GET | /product/:id | Get product reviews | Public |
| GET | /service/:id | Get service reviews | Public |
| GET | /user/:id | Get user reviews | Public |

### Messages — `/api/messages`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | /conversations | Get all conversations | Private |
| GET | / | Get messages (query: roomId) | Private |
| POST | / | Send message | Private |

### Notifications — `/api/notifications`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | / | Get all notifications | Private |
| PUT | /:id/read | Mark notification as read | Private |
| PUT | /read-all | Mark all as read | Private |

### Nearby — `/api/listings/nearby`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | / | Get nearby products & services | Private |

### Reports — `/api/reports`
| Method | Path | Description | Access |
|---|---|---|---|
| POST | / | Report content | Private |
| GET | /content/:type/:id | Get reports for content | Private |

### Admin — `/api/admin`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | /dashboard/stats | Get platform statistics | Admin |
| GET | /dashboard/activity | Get recent activity | Admin |
| GET | /users | Get all users | Admin |
| PUT | /users/:id/suspend | Suspend/reactivate user | Admin |
| GET | /products | Get all products | Admin |
| PUT | /products/:id/status | Approve/reject product | Admin |
| GET | /services | Get all services | Admin |
| PUT | /services/:id/status | Approve/reject service | Admin |
| GET | /reports | Get all reports | Admin |
| PUT | /reports/:id/resolve | Resolve report | Admin |

### Health — `/api/health`
| Method | Path | Description | Access |
|---|---|---|---|
| GET | / | API and database health check | Public |

---

## 🚀 Deployment

### Vercel (Recommended)

Markiit is configured for seamless Vercel deployment with serverless functions.

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` (your production URL)
   - `VITE_API_URL` (your production API URL)
4. Deploy!

The root [`vercel.json`](vercel.json) handles:
- Building the React client as static files
- Routing `/api/*` requests to the serverless backend
- Serving the client for all other routes

---

## 🔮 Future Roadmap

- [ ] Email notifications for bookings, messages, and reviews
- [ ] Push notifications (Web Push API)
- [ ] Advanced search with Elasticsearch
- [ ] Payment integration (Stripe / JazzCash / EasyPaisa)
- [ ] Multi-language support (i18n)
- [ ] Seller/Provider verification badges
- [ ] Advanced analytics for sellers
- [ ] Mobile app (React Native)

---

## 👤 Author

**Muhammad Khuzaima**  
Graphic Designer · Logo & Brand Identity Expert · UI/UX Designer · MERN Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin&labelColor=080E0D)](https://www.linkedin.com/in/muhammad-khuzaima-991a08313)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-333?style=flat&logo=github&labelColor=080E0D)](https://github.com/muhammadkhuzaima25)

---

## 📄 License

**All Rights Reserved.** Copyright © 2026 Muhammad Khuzaima.  
This project is for **viewing and evaluation purposes only.**

---

<p align="center">
  <strong>⭐ Found Markiit useful or impressive? Drop a star!</strong><br>
  <sub>Built from scratch — every feature thought through, every bug fixed.<br>
  A star costs nothing but means everything. 🙏</sub>
</p>

<p align="center">
  <a href="https://github.com/yourusername/markiit">
    <img src="https://img.shields.io/badge/⭐_Star_this_repo-Show_some_love-00C27A?style=for-the-badge&labelColor=080E0D" alt="Star this repo">
  </a>
</p>
