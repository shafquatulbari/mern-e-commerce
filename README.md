# Medicine Store E-commerce Platform

This project is a fully functional e-commerce platform for a medicine store, built with the MERN stack (MongoDB, Express.js, React, and Node.js) and styled using Tailwind CSS. The platform includes both a customer-facing interface and an admin panel to manage the store effectively. It also integrates Stripe for secure payment processing.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
   - [Admin Panel](#admin-panel)
   - [Customer Interface](#customer-interface)
3. [Technologies Used](#technologies-used)
4. [Setup and Installation](#setup-and-installation)
5. [Environment Variables](#environment-variables)
6. [Folder Structure](#folder-structure)
7. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Product Endpoints](#product-endpoints)
   - [Category Endpoints](#category-endpoints)
   - [Manufacturer Endpoints](#manufacturer-endpoints)
   - [Order Endpoints](#order-endpoints)
   - [Review Endpoints](#review-endpoints)
   - [Chat Endpoints](#chat-endpoints)
8. [Stripe Integration](#stripe-integration)
9. [Notifications](#notifications)
10. [Future Improvements](#future-improvements)
11. [License](#license)

---

## Overview

The Medicine Store E-commerce Platform provides an efficient and secure way to manage an online medicine store. Customers can browse and order products, while the admin has full control over product management, order status, and reviews. The application is built using the MERN stack, with real-time updates and notifications to enhance the user experience.

---

## Features

### Admin Panel

- **View/Edit Products**: Admins can view, update, or delete any product details, including images, descriptions, stock levels, and prices.
- **Manage Categories**: Admins can create, edit, or delete product categories.
- **Manage Manufacturers**: Admins can add, update, or delete manufacturer details.
- **Order Management**: Admins can change the status of orders to "on-delivery" or "delivered" and view the entire list of orders.
- **Review Management**: Admins have the right to delete any review they find inappropriate or unnecessary.
- **Low Stock Notifications**: Admins receive notifications for products that have a stock level below a specified threshold.

### Customer Interface

- **Product Browsing**: Customers can browse products by category and search for specific items.
- **Cart Functionality**: Customers can add products to their cart, update quantities, or remove items.
- **Order Placement**: Customers can place orders and make payments securely using Stripe.
- **Order History**: Customers can view their past orders and cancel any order that hasn't been delivered yet.
- **Review System**: Customers can leave reviews on products they have purchased and delete their own reviews if needed.
- **Order Notifications**: Customers receive notifications when their order status changes to "delivered."

---

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: Stripe
- **Styling**: Tailwind CSS
- **Icons and Animations**: React Icons, CountUp.js for animations
- **Notifications**: Custom notifications for admin and customer updates

---

### New Features

#### 1. Support Chat Functionality

The platform now supports real-time chat between customers and admins:

**Admin Panel:**

- View a list of active customer chats.
- Send and receive messages with real-time updates using Socket.IO.
- See customer details like name and email in the chat information panel.

**Customer Interface:**

- Start a chat with the admin from the customer dashboard.
- View chat history and communicate in real time.

**Tech Stack:**

- **Backend**: Implemented with Socket.IO, Express.js, and MongoDB for chat persistence.
- **Frontend**: Real-time communication integrated into React components using the Socket.IO client.

#### 2. OCR-based Prescription Scanner

The platform introduces a **Prescription Scanner** that uses Google Vision API for Optical Character Recognition (OCR):

- Customers can upload prescription images.
- Extracted text is matched with the database to fetch recommended medicines.
- Customers can add the matched medicines directly to the cart.

**Tech Stack:**

- **Backend**: Google Vision API integrated via Express.js for text extraction.
- **Frontend**: File upload and image preview implemented with React and Tailwind CSS.

---

## Setup and Installation

### Prerequisites

- **Node.js** and **npm** installed
- **MongoDB** set up locally or on a cloud service (e.g., MongoDB Atlas)
- **Stripe** account for payment processing

### Installation Steps (continued)

6. **Set Up Frontend Environment Variables**:

   - Create a `.env` file in the `frontend` directory (if needed) and configure any environment variables specific to the frontend setup, such as:
     ```env
     REACT_APP_API_URL=http://127.0.0.1:4000/api
     REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
     ```

7. **Start Both Servers**:

   - **Run the backend**:
     ```bash
     cd server
     npm run server (for nodemon)
     ```
   - **Run the frontend**:
     ```bash
     cd client
     npm start
     ```

8. **Access the Application**:
   - The frontend should be available at `http://localhost:3000`
   - The backend API should be running at `http://127.0.0.1:4000`

---

## Folder Structure

### Backend

- **controllers/**: Logic for handling requests (user, product, order, etc.)
- **models/**: Mongoose models for MongoDB collections
- **routes/**: API routes for different entities
- **middleware/**: Middleware for authentication and error handling
- **utils/**: Utility functions, like token generation

### Frontend

- **components/**: Reusable React components
- **context/**: Context API for managing global state (AuthContext, CartContext)
- **pages/**: Main pages, like Home, Product Details, Cart, and Admin Dashboard
- **services/**: API service for handling HTTP requests with Axios
- **styles/**: Tailwind CSS and custom styles

---

## API Endpoints

### User Endpoints

- **POST /api/users/register**: Register a new user
- **POST /api/users/login**: Authenticate a user and return a JWT
- **GET /api/users/user-info**: Retrieve information about the logged-in user (protected)

### Product Endpoints

- **GET /api/products/**: Fetch all products
- **GET /api/products/:id**: Fetch a specific product by ID
- **POST /api/products/**: Add a new product (admin only)
- **PUT /api/products/:id**: Update product details (admin only)
- **DELETE /api/products/:id**: Delete a product (admin only)

### Category Endpoints

- **GET /api/categories/**: Fetch all product categories
- **POST /api/categories/**: Create a new category (admin only)
- **PUT /api/categories/:id**: Update category details (admin only)
- **DELETE /api/categories/:id**: Remove a category (admin only)

### Manufacturer Endpoints

- **GET /api/manufacturers/**: Fetch all manufacturers
- **POST /api/manufacturers/**: Add a new manufacturer (admin only)
- **PUT /api/manufacturers/:id**: Edit manufacturer details (admin only)
- **DELETE /api/manufacturers/:id**: Remove a manufacturer (admin only)

### Order Endpoints

- **GET /api/orders/**: Get all orders (admin only)
- **GET /api/orders/user**: Get orders of the logged-in user
- **POST /api/orders/**: Place a new order
- **PUT /api/orders/:id/status**: Change order status (admin only)
- **DELETE /api/orders/:id**: Cancel an order (user)

### Review Endpoints

- **POST /api/products/:id/reviews**: Leave a review for a product
- **DELETE /api/products/:id/reviews/:reviewId**: Remove a review (user/admin)

### Chat Endpoints

- **GET /api/chats/**: Fetch a list of active chats (admin only).
- **GET /api/chats/:customerId**: Retrieve all messages exchanged with a specific customer.
- **POST /api/chats/**: Send a message (admin or customer).

### OCR Endpoint

- **POST /api/google/ocr**: Upload an image to extract text using Google OCR.

---

## Stripe Integration

Stripe is used to handle secure payment processing. Ensure your Stripe API keys are correctly set up in your environment variables:

- **STRIPE_SECRET_KEY** for the backend
- **REACT_APP_STRIPE_PUBLIC_KEY** for the frontend

---

## Notifications

- **Admin Notifications**: Low stock alerts are shown in the admin dashboard.
- **Customer Notifications**: Order status updates (like "delivered") are displayed on the customer interface.

---

## Future Improvements

- **Wishlist Feature**: Allow customers to add products to a wishlist for future purchase.
- **Email Notifications**: Send automated emails for order confirmations and status updates.
- **Search Filters**: Add filters for better product browsing (by category, price range, etc.).

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

Feel free to contribute to this project or open an issue if you find any bugs!
