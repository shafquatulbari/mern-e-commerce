// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProductList from "./components/products/ProductList";
import CategoryList from "./components/categories/CategoryList";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import CategoryProducts from "./components/categories/CategoryProducts";
import ManufacturerList from "./components/manufacturers/ManufacturerList";
import ManufacturerProducts from "./components/manufacturers/ManufacturerProducts";
import CartModal from "./components/cart/CartModal";
import ProductDetails from "./components/products/ProductDetails";
import UserOrders from "./components/orders/UserOrders";
import AdminOrderPage from "./pages/AdminOrderPage";
import img2 from "../src/components/image/2.webp";
import Footer from "./components/footer/Footer";
//import NewHeader from "./components/header/NewHeader";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className=" w-full ">
            {/*<NewHeader />*/}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route
                path="/categories/:categoryId/products"
                element={<CategoryProducts />}
              />
              <Route path="/manufacturers" element={<ManufacturerList />} />
              <Route
                path="/manufacturers/:manufacturerId/products"
                element={<ManufacturerProducts />}
              />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<CartModal />} />
              <Route path="/orders" element={<UserOrders />} />
              <Route path="/admin/orders" element={<AdminOrderPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
