# 🏎️ RideFleet - Premium Fleet Rental Platform

RideFleet is a high-end, full-stack vehicle rental application designed for luxury and performance. This platform provides a seamless experience for users to browse, book, and manage premium vehicle rentals with a sophisticated and modern user interface.

![RideFleet Preview](https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80)

## ✨ Features

### 🌟 For Users
- **Bespoke Browsing**: Explore a curated collection of luxury vehicles with high-quality imagery and detailed specifications.
- **Advanced Filtering**: Filter vehicles by type (SUV, Sedan, Electric, etc.), brand, and price.
- **Dynamic Booking**: Real-time availability checking and a streamlined checkout process.
- **User Dashboard**: Manage active bookings, view rental history, and track vehicle status.
- **Secure Authentication**: JWT-based secure login and account management.

### 🛡️ For Administrators
- **Admin Hub**: A powerful command center to monitor business performance.
- **Fleet Management**: Add, update, or remove vehicles from the fleet.
- **Booking Oversight**: View and manage all user reservations in one place.
- **Analytics Visuals**: Interactive charts (Recharts) showing rental trends and revenue.

## 🚀 Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RideFleet
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ADMIN_SECRET=your_admin_secret_key
   ```

4. **Seed the Database** (Optional but recommended for demo)
   ```bash
   npm run seed
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   npm run server
   ```

2. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend).

## 📁 Project Structure

```text
RideFleet/
├── server/             # Express.js backend
│   ├── config/         # DB connection & config
│   ├── middleware/     # Auth & validation middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   └── index.js        # Server entry point
├── src/                # React frontend
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page layouts
│   ├── store/          # Zustand state stores
│   ├── styles/         # Global CSS & Tailwind
│   └── App.jsx         # Main application component
└── public/             # Static assets
```

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Raghul.S]
