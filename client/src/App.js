import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cart" element={<CartModal />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
