import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "../src/context/AuthContext";
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
import Footer from "./components/footer/Footer";
import NewHeader from "./components/header/NewHeader";
import AdminChatPage from "./components/supportChat/AdminChatPage";
import FileScanner from "./pages/FileScanner";
import SupportChat from "./components/supportChat/SupportChat";

function Layout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="w-full">
      {/* Show Navbar only if not on Login or Register pages */}
      {location.pathname !== "/" && location.pathname !== "/register" && (
        <NewHeader />
      )}
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
        <Route path="/admin/chatbar" element={<AdminChatPage />} />
        <Route path="/prescription" element={<FileScanner />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Show Support Chat for logged-in non-admin users */}
      {user && !user.isAdmin && <SupportChat />}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
