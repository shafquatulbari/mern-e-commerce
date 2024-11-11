import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import ProductForm from "../products/ProductForm";
import { AuthContext } from "../../context/AuthContext";
import Header from "../header/header";
import BackButton from "../common/BackButton";
import moment from "moment";

const ManufacturerProducts = () => {
  const { manufacturerId } = useParams(); // Get the manufacturer ID from the URL
  const [products, setProducts] = useState([]);
  const [manufacturerName, setManufacturerName] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch products by manufacturer
  const fetchProductsByManufacturer = async () => {
    try {
      const response = await api.get(
        `manufacturers/${manufacturerId}/products/`
      );
      setProducts(response.data);

      // Fetch manufacturer name
      const manufacturerResponse = await api.get(
        `manufacturers/${manufacturerId}/`
      );
      setManufacturerName(manufacturerResponse.data.name);
    } catch (error) {
      console.error("Error fetching products by manufacturer:", error);
    }
  };

  useEffect(() => {
    fetchProductsByManufacturer();
  }, [manufacturerId]);

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSave = () => {
    fetchProductsByManufacturer();
    setShowForm(false);
  };

  return (
    <>
      <Header />
      <div className="p-6">
        <BackButton />
        <h1 className="text-3xl font-bold mb-6">
          Products from {manufacturerName}
        </h1>
        {showForm && (
          <ProductForm product={editingProduct} onSave={handleFormSave} />
        )}
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg shadow-md">
              <Link to={`/products/${product._id}`}>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="mb-2"
                />
              </Link>
              <p>Price: ${product.price}</p>
              <p>Stock: {product.stock_level}</p>
              <p>{product.description}</p>
              <p>
                Updated: {moment(product.updatedAt).format("MMMM Do, YYYY")}
              </p>
              {user && user.isAdmin && (
                <button
                  className="bg-yellow-500 text-white p-2 rounded mt-2 mr-2"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
        <Link to="/manufacturers" className="mt-4 inline-block text-blue-500">
          Back to Manufacturers
        </Link>
      </div>
    </>
  );
};

export default ManufacturerProducts;
