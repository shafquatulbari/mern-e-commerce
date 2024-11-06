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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container mx-auto">
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
