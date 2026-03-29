# 🆔 Digital ID Verification Portal

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)

An intuitive, fast, and scalable web application built to streamline and secure the digital identification process for various events. This solution leverages modern web technologies to handle student validations, event management, and administrative tasks seamlessly.

## ✨ Features

- **🎓 Student Portal:** Dedicated routes for students to verify IDs, register for events, and manage their profile.
- **📅 Event Management:** Comprehensive system for exploring, creating, and tracking campus or external events.
- **🛡️ Admin Dashboard:** High-level administrative controls with secure authentication and session management.
- **📸 File Uploads:** Supports image and document uploads (e.g., ID cards) via Multer.
- **🔒 Secure Data:** Fully integrated with Bcrypt for password hashing and Express Session for stateful security.
- **⚡ Dynamic UI:** Employs EJS templating for fully server-side rendered dynamic pages with quick load times.

---

## 📂 Project / File Structure

A clean and intuitive Model-View-Controller (MVC) architecture ensuring scalability and maintainability.

```text
📦 DIGITAL-main
 ┣ 📂 config          # Database connection and environment configurations
 ┣ 📂 controllers     # Core business logic processing requests and interfacing with models
 ┣ 📂 middleware      # Custom middleware (Authentication guards, Error handlers)
 ┣ 📂 models          # Mongoose database schemas and models for MongoDB
 ┣ 📂 public          # Static assets (CSS styles, Client-side JS, Images)
 ┣ 📂 routes          # Express router modules defining API points and page routes
 ┣ 📂 views           # EJS templates for server-side view rendering
 ┣ 📜 .env            # Environment variables configuration
 ┣ 📜 .env.example    # Example environment variables template
 ┣ 📜 package.json    # Project metadata, scripts, and npm dependencies
 ┣ 📜 seed.js         # Basic database seeding utility for initial data
 ┗ 📜 server.js       # Main application entry point and server setup
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Cloud Atlas URI)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd DIGITAL-main
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Ensure your `.env` file is properly configured.
   - Fill in your `PORT`, `MONGO_URI`, and `SESSION_SECRET` values.
   ```bash
   cp .env.example .env
   ```

4. **Seed the Database (Optional):**
   *(Populates the database with initial Admin accounts or Event data)*
   ```bash
   node seed.js
   ```

5. **Start the Application:**
   
   For development with live-reloading (using nodemon):
   ```bash
   npm run dev
   ```
   
   For production:
   ```bash
   npm start
   ```

The server should now be running. By default, it will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 💻 Tech Stack & Code Insights

- **Entry Point:** `server.js` serves as the primary entry point setting up Express middleware, view engines, routing, and Mongoose connections.
- **Routing:** modularized inside `routes/` to separate endpoints logically (`studentRoutes.js`, `eventRoutes.js`, `adminRoutes.js`).
- **State & Communication:** State management and flash messaging are efficiently managed using `express-session` and `connect-flash`.
- **Database:** MongoDB acts as the primary data store, manipulated elegantly through `mongoose` models.

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change or improve.

## 📄 License
This project is licensed under the [ISC License](LICENSE).
