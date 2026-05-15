# Wedding Platform 2.0: Professional Booking & Management System

This document outlines the transition from a simple inquiry site to a full-scale **Wedding Management Platform**.

## 1. Core User Journeys

### A. The Client Journey
1.  **Selection (The Menu)**: Client browses dynamic services and "Adds to Portfolio" (multiple selections).
2.  **Account Creation**: Client creates a profile with a password to save their "Wedding Portfolio" (draft booking).
3.  **Draft Management**: Client can login anytime to update selections, delete items, or change event details.
4.  **Finalization**: Client submits the portfolio for Admin review.
5.  **Tracking**: Client sees real-time status updates (e.g., "Reviewing", "Payment Pending", "Work in Progress").

### B. The Admin Journey
1.  **Dashboard Overview**: View all active booking pipelines and statuses.
2.  **Processing**: Update booking statuses which triggers automatic notifications to the client.
3.  **Content Management**: Same as existing panel but with enhanced control over the "Menu" prices and categories.

---

## 2. Technical Requirements

| Feature | Implementation Detail |
| :--- | :--- |
| **Authentication** | Secure Client Login/Password using Supabase Auth. |
| **Data Structure** | New `portfolios` and `orders` tables in the database. |
| **Notifications** | Automatic status sync between Admin and Client Dashboard. |
| **Dynamic Menu** | Services will have "Price" and "Category" fields for selection logic. |

---

## 4. Selection & Availability Flow

### How Clients Select
*   **Services**: Each service on the `services.html` page will feature an **"Add to Portfolio"** button. Clients can select multiple items to build their custom package.
*   **Images**: On the `portfolio.html` page, clients can "pin" or "save" specific masterpieces to their draft, creating a visual mood board for their event.

### Where it is Available
*   **Client Dashboard**: A private, password-protected area where clients view their "Wedding Portfolio."
*   **Management**: From this dashboard, clients can add, update, or delete selections before final submission.
*   **Admin Sync**: Once the client finalizes, the entire portfolio (selected services + saved images) appears in the Admin Dashboard for processing.

---

## 5. Implementation Phases

### Phase 1: Database & Auth
- [x] Create `client_profiles` table.
- [x] Create `client_portfolios` table (linked to services).
- [x] Implement Sign-up/Login logic.

### Phase 2: Client Interface
- [x] "Add to Portfolio" functionality on Services page.
- [x] Client Dashboard UI (View/Update/Delete selections).

### Phase 3: Admin Command Center
- [x] New Pipeline view for all bookings.
- [x] Status update triggers.

---
**Status: COMPLETED & LIVE**

## Reference Mockups (Saved in Project Root)
- **Client Dashboard**: [client_dashboard_mock.png](client_dashboard_mock.png)
- **Admin Pipeline**: [admin_pipeline_mock.png](admin_pipeline_mock.png)
