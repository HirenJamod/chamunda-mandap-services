# Chamunda Mandap Services 🌸

A premium full-stack platform for wedding decoration and mandap services, featuring a real-time booking system, admin management dashboard, and client tracking portal.

![Project Preview](hero_mandap_decoration_1778151874213.png)

## ✨ Features

- **Royal Aesthetic UI**: Modern, responsive design using Playfair Display and Montserrat typography.
- **Dynamic Booking**: Customer inquiry form with date validation (prevents past-date bookings).
- **Admin Dashboard**: Secured portal for the business owner to manage inquiries, update statuses, and view business analytics.
- **Client Portal**: Dedicated space for customers to track their booking status (Pending/Confirmed/Rejected).
- **WhatsApp Integration**: Floating chat button for instant customer conversion.
- **Local SEO**: Integrated JSON-LD schema for better search engine visibility.
- **Persistent Database**: Powered by SQLite for reliable customer data management.

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Icons/Fonts**: Font Awesome, Google Fonts

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (installed with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chamunda-mandap-services.git
   cd chamunda-mandap-services
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Main Site: `http://localhost:3000`
   - Admin Login: `http://localhost:3000/login.html`
   - Client Portal: `http://localhost:3000/client.html`

## 🔐 Security

The Admin Dashboard is protected by a password.
- **Default Password**: `admin_chamunda`
*(To change this, update line 15 in `server.js`)*

## ☁️ Deployment (Render)

This project is configured with a `render.yaml` Blueprint for 1-click deployment on [Render](https://render.com).

1. Connect your GitHub repo to Render.
2. Select **Blueprint** when creating a new service.
3. Your site will be live automatically!

## 📜 License
Distributed under the MIT License.

---
*Created with ❤️ for Chamunda Mandap Services*
