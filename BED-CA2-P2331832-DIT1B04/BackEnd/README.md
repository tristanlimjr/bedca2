# 🚀 Cosmic Odyssey - Full-Stack Web Application

Cosmic Odyssey is a futuristic-themed web application where users can explore, complete challenges, and claim daily rewards. This project integrates front-end and back-end components to provide a seamless user experience.

---w

## 📌 Directory
Public
 │── css/ 
 │ ├── dashboard.css 
 │ ├── main.css 
 │ ├── profile.css 
 │ ├── style.css 
 │ │── script/ 
 │ ├── challenges.js 
 │ ├── dashboard.js 
 │ ├── index.js 
 │ ├── login.js 
 │ ├── profile.js 
 │ ├── register.js 
 │ ├── reviews.js 
 │ ├── token.js 
 │ ├── challenges.html
 │ ├── dashboard.html 
 │ ├── index.html 
 │ ├── login.html 
 │ ├── profile.html 
 │ ├── register.html 
 │ ├── reviews.html
Backend
 │ │── src/ 
 │ │── configs/ 
 │ │ ├── initTables.js 
 │ │ │ │── controllers/ 
 │ │ ├── authController.js 
 │ │ ├── colonyController.js 
 │ │ ├── fitnessController.js 
 │ │ ├── inventoryController.js 
 │ │ ├── partyController.js 
 │ │ ├── planetController.js 
 │ │ ├── questsController.js 
 │ │ ├── reviewController.js 
 │ │ ├── userController.js 
 │ │ │ │── middleware/ 
 │ │ ├── authMiddleware.js 
 │ │ │ │── models/ 
 │ │ ├── colonyModel.js 
 │ │ ├── fitnessModel.js 
 │ │ ├── inventoryModel.js 
 │ │ ├── partyModel.js 
 │ │ ├── planetModel.js 
 │ │ ├── questsModel.js 
 │ │ ├── reviewModel.js
 │ │ ├── userModel.js  
 │ │ │ │── routes/ 
 │ │ ├── auth.js 
 │ │ ├── colonyRoutes.js 
 │ │ ├── fitnessRoutes.js 
 │ │ ├── inventoryRoutes.js 
 │ │ ├── mainRoutes.js 
 │ │ ├── planetRoutes.js 
 │ │ ├── questsRoutes.js 
 │ │ ├── reviewRoutes.js 
 │ │ ├── userRoutes.js 
 │ │ │── services/ 
 │ │ ├── db.js 
 │ ├── space-background.jpg 
 │ │── .env 
 │── .gitignore 
 │── app.js 
 │── index.js
 │── package.json 
 │── package-lock.json 
 │── README.md

## 📌 Features
- **User Registration & Login** (Authentication)
- **Claim a Free Daily Item** (with 24-hour cooldown)
- **Challenges & Progress Tracking**
- **View profile stats**
- **Reviews & Feedback Section**
- **Backend API Integration** with a database

---

## 🛠️ Technologies Used
### **Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5
- Fetch API for HTTP requests

### **Backend**
- Node.js & Express.js
- MongoDB / PostgreSQL (choose based on your setup)
- JWT Authentication (if implemented)

---

## 🚀 Getting Started

### **1️⃣ Prerequisites**
Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v16+ recommended)
- Git (to clone the repository)

---

### **2️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/cosmic-odyssey.git
cd cosmic-odyssey

