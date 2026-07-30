# DETAILED PROJECT REPORT (DPR)

# SwapMarket: Sustainable Clothing Exchange Marketplace

**A Full-Stack Web Application for Peer-to-Peer Cashless Clothing Trading**

---

### Student / Developer Details
- **Student Name:** Aaqib Baig
- **GitHub Username:** aaqibbaig376-prog
- **Project Title:** SwapMarket
- **Platform:** Unified Mentor Final Project
- **Date of Submission:** July 30, 2026
- **Status:** Production Deployed & Verified

---

## 1. ABSTRACT

**SwapMarket** is an innovative full-stack web application designed to promote sustainable fashion by providing a cashless peer-to-peer marketplace where users can exchange pre-loved clothing. With fast fashion contributing to over 92 million tons of textile waste globally every year, SwapMarket encourages a circular fashion economy by enabling users to upload unused clothing items and trade them for items listed by others in their community.

Built using **React 18**, **Vite**, **TailwindCSS**, **Node.js**, **Express.js**, and **SQLite (via Sequelize ORM)**, SwapMarket provides user authentication, dynamic search and multi-parametric filtering, transaction management, real-time contextual chat, wishlisting, automated notifications, dark/light mode customization, and an administrative moderation panel. 

The application is deployed live with a decoupled architecture: the React frontend runs on **Vercel Edge Network**, and the Express REST API runs on **Render Cloud Services**.

---

## 2. INTRODUCTION & MOTIVATION

### 2.1 Background
The apparel industry is currently one of the largest industrial polluters in the world. Consumers buy 60% more clothing items today than in the year 2000, yet keep garments for only half as long. A significant portion of wearable clothing ends up in municipal landfills or incinerators.

### 2.2 Problem Statement
- **Textile Waste Accumulation:** Millions of wearable clothes are discarded prematurely.
- **Closet Value Stagnation:** The average individual wears less than 50% of the garments in their closet.
- **Financial Barriers:** High prices of ethically manufactured sustainable apparel discourage price-sensitive consumers from making eco-friendly choices.

### 2.3 Motivation & Solution
SwapMarket addresses these issues by introducing **Cashless Garment Exchange**. By removing monetary transactions, clothing items themselves become the medium of exchange. This gamifies decluttering, eliminates financial barriers, and fosters local community connections while extending clothing lifecycles.

---

## 3. PROJECT OBJECTIVES & SCOPE

### 3.1 Primary Objectives
1. **Develop a Cashless Exchange Platform:** Enable users to list clothes and trade directly without money.
2. **Implement Intuitive Discovery:** Provide real-time keyword search, category filters, size matching, and location filtering.
3. **Build Transaction Workflow:** Create a structured swap lifecycle (`Pending` -> `Accepted` / `Rejected` -> `Completed`).
4. **Enable Safe In-App Communication:** Instantiated private chat rooms upon swap acceptance for safe coordination.
5. **Ensure Administrative Oversight:** Provide moderation tools to inspect content, control roles, and ban offending users.
6. **Deliver Modern Responsive Design:** Support Dark Mode 🌙 / Light Mode ☀️ with sub-second page response times.

### 3.2 System Scope
- **Included:** User authentication (JWT), closet management, search/filter engine, swap proposal engine, in-app messaging, favorites, notifications, admin panel, dark mode.
- **Out of Scope for v1.0:** Monetary payment gateways (deliberately cashless), third-party courier APIs.

---

## 4. SYSTEM ANALYSIS & FEASIBILITY STUDY

### 4.1 Technical Feasibility
The chosen tech stack (**React**, **Node.js**, **Express**, **SQLite**, **TailwindCSS**) is well-established, scalable, and open-source. The REST API architecture guarantees clear separation between frontend presentation and backend business logic.

### 4.2 Economic Feasibility
The platform utilizes free-tier cloud deployment models:
- **Vercel:** Free hosting for React SPA with automated global CDN distribution.
- **Render:** Free hosting for Node.js Web Services.
- **SQLite:** Lightweight zero-cost database engine.
Thus, operational overhead is zero while offering high reliability.

### 4.3 Operational Feasibility
The user interface adheres to modern UX guidelines with intuitive navigation bars, visual badges, toast alerts, and dark mode toggles, requiring zero learning curve for users familiar with e-commerce sites like OLX or thrift apps.

---

## 5. SYSTEM REQUIREMENTS SPECIFICATION (SRS)

### 5.1 Software Requirements
- **Frontend Framework:** React 18, React Router v6
- **Build Tool & Bundler:** Vite 8
- **Styling & Icons:** TailwindCSS, React Icons
- **HTTP Client:** Axios with JWT Interceptors
- **Backend Runtime:** Node.js v18+
- **Server Framework:** Express.js 5
- **ORM & Database:** Sequelize ORM with SQLite database
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Deployment Platform:** Vercel (Frontend), Render (Backend), GitHub (Version Control)

### 5.2 Hardware Requirements
- **Development Environment:** Dual-core CPU, 8 GB RAM, 500 MB disk space.
- **Production Server:** Render 512 MB RAM, 0.1 CPU instance.

---

## 6. SYSTEM ARCHITECTURE & DESIGN

### 6.1 System Architecture Diagram

```
+-------------------------------------------------------------------+
|                        REACT FRONTEND (Vercel)                    |
|  [Navbar] [Home/Catalog] [ItemDetail] [SwapRequest] [Chat] [Admin]  |
+---------------------------------+---------------------------------+
                                  |
                                  | REST API Calls (JSON / JWT)
                                  v
+-------------------------------------------------------------------+
|                        EXPRESS BACKEND (Render)                   |
|  /api/auth   /api/items   /api/swaps   /api/messages   /api/admin |
+---------------------------------+---------------------------------+
                                  |
                                  | Sequelize ORM Queries
                                  v
+-------------------------------------------------------------------+
|                        SQLITE DATABASE                            |
|  [Users] [Items] [SwapRequests] [Messages] [Favorites] [Notifs]   |
+-------------------------------------------------------------------+
```

### 6.2 Data Schema (Entity Relationship)

- **Users Table:** `id` (PK), `name`, `email`, `password` (hashed), `location`, `role` (`user`/`admin`), `createdAt`, `updatedAt`
- **Items Table:** `id` (PK), `title`, `description`, `type`, `brand`, `size`, `condition`, `estimatedValue` (INR ₹), `location`, `status`, `imageUrls` (JSON array), `ownerId` (FK -> Users.id)
- **SwapRequests Table:** `id` (PK), `requesterId` (FK -> Users.id), `ownerId` (FK -> Users.id), `requestedItemId` (FK -> Items.id), `offeredItemId` (FK -> Items.id), `status` (`pending`/`accepted`/`rejected`/`completed`)
- **Messages Table:** `id` (PK), `swapRequestId` (FK -> SwapRequests.id), `senderId` (FK -> Users.id), `content`, `createdAt`
- **Favorites Table:** `id` (PK), `userId` (FK -> Users.id), `itemId` (FK -> Items.id)
- **Notifications Table:** `id` (PK), `userId` (FK -> Users.id), `message`, `isRead`, `linkUrl`

---

## 7. IMPLEMENTATION DETAILS

### 7.1 Key Features Implemented

1. **User Authentication & RBAC:**
   - Registration and login issuing JWT Bearer tokens. Passwords hashed using `bcryptjs`.
   - Axio request interceptor automatically attaches `Authorization: Bearer <token>` header to all outgoing API requests.

2. **Item Catalog & Image Handling:**
   - Full CRUD operations for clothing listings. Supports multi-image arrays serialized as JSON.
   - Values displayed in **Indian Rupees (INR ₹)**.

3. **Search & Multi-Filter Engine:**
   - Client-side and server-side filtering by category (Shirt, Pants, Jacket, Dress, Accessories), condition (New with tags, Like New, Good, Fair), location, and keyword.

4. **Swap Request Workflow:**
   - Modal prompt allowing requesters to select one of their available items to trade.
   - Status updates update item availability automatically.

5. **Contextual Messaging System:**
   - Instantiates a private chat room upon swap acceptance, storing time-stamped chat histories between trading partners.

6. **Dark & Light Mode:**
   - Built with TailwindCSS `dark:` modifier class strategy and browser LocalStorage state preservation.

7. **Admin Moderation Panel:**
   - Dedicated dashboard accessible only to accounts with `role: 'admin'`, granting oversight to view metrics, ban users, and remove inappropriate listings.

---

## 8. DEPLOYMENT & PRODUCTION CONFIGURATION

| Component | Platform | Configuration | Live URL |
|---|---|---|---|
| **Frontend** | Vercel | SPA Routing (`client/vercel.json`), Vite preset | `https://swapmarket-three.vercel.app/` |
| **Backend** | Render | Node.js Runtime, Root Dir: `server`, Auto-seed | `https://swapmarket.onrender.com/` |
| **Version Control**| GitHub | Master branch auto-trigger CD pipeline | `https://github.com/aaqibbaig376-prog/SwapMarket` |

---

## 9. TESTING & VERIFICATION RESULTS

### 9.1 Test Cases Executed

| Test ID | Module | Scenario | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Auth | Register new user account | Account created, JWT returned, redirected to home | PASS |
| TC-02 | Auth | Login with incorrect password | Returns HTTP 400 error message | PASS |
| TC-03 | Items | Add new item with images & INR value | Item created and displayed in catalog | PASS |
| TC-04 | Search | Filter items by category "Jacket" | Only jackets displayed | PASS |
| TC-05 | Swaps | Propose swap item for item | Swap created in `pending` status | PASS |
| TC-06 | Swaps | Accept swap request | Status changes to `accepted`, chat unlocked | PASS |
| TC-07 | Chat | Send message in accepted swap | Message appears in chat log | PASS |
| TC-08 | Theme | Toggle dark/light mode button | UI colors switch instantly, saved in LocalStorage | PASS |
| TC-09 | Admin | Access admin panel with regular user | Access blocked | PASS |
| TC-10 | Admin | Delete item via Admin Panel | Item removed from database and UI | PASS |

---

## 10. CONCLUSION & FUTURE SCOPE

### 10.1 Conclusion
**SwapMarket** successfully fulfills the objective of creating a functional, beautiful, and secure peer-to-peer sustainable fashion exchange marketplace. By leveraging modern full-stack web technologies, the application delivers a seamless experience for eco-conscious users while promoting circular economy principles.

### 10.2 Future Scope (Version 2.0 Roadmap)
1. **Interactive Geolocation Map:** Integration with Google Maps API to display neighboring closets within a 5-10 km radius.
2. **Push Notifications:** Web Push / Service Worker integration for instant trade updates on mobile devices.
3. **AI Garment Valuation:** Computer vision model to automatically suggest fair trading values from uploaded photos.
4. **Courier Logistics Integration:** Automated shipping label generation via logistics APIs.

---

## 11. DEMO ACCOUNTS FOR EVALUATION

| Role | Email | Password | Access Rights |
|---|---|---|---|
| **Regular User** | `jane@example.com` | `password123` | Listing, Swapping, Wishlist, Messaging |
| **Regular User** | `john@example.com` | `password123` | Listing, Swapping, Wishlist, Messaging |
| **Administrator** | `admin@swapstyle.com` | `admin123` | Full System & Moderation Control |

---

**Report Prepared By:** Aaqib Baig  
**Project Repository:** https://github.com/aaqibbaig376-prog/SwapMarket  
**Live Application:** https://swapmarket-three.vercel.app/
