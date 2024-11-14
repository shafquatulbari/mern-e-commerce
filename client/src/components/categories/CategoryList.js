import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../common/BackButton";
import Tilt from "react-parallax-tilt"; // Import React Tilt
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import React Icons

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // State for image URL
  const [error, setError] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCategories = async () => {
    try {
      const response = await api.get("categories/");
      setCategories(response.data || []); // Ensure the response is an array
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImage(""); // Reset image field
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
    setImage(category.image); // Set image URL for editing
    setShowForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`categories/${categoryId}/`);
      setCategories(categories.filter((cat) => cat._id !== categoryId));
    } catch (error) {
      setError("Failed to delete category");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update existing category
        const response = await api.put(`categories/${editingCategory._id}/`, {
          name,
          description,
          image, // Include image URL
        });
        const updatedCategories = categories.map((cat) =>
          cat._id === editingCategory._id ? response.data : cat
        );
        setCategories(updatedCategories);
      } else {
        // Add a new category
        const response = await api.post("categories/", {
          name,
          description,
          image, // Include image URL
        });
        setCategories([...categories, response.data]);
      }
      setName("");
      setDescription("");
      setImage(""); // Reset image field
      setEditingCategory(null);
      setShowForm(false);
    } catch (err) {
      setError("Failed to save category");
    }
  };

  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      {/* Admins can add/edit categories */}
      {user && user.isAdmin && (
        <>
          <button
            className="bg-green-500 text-white p-2 rounded mb-4"
            onClick={handleAddCategory}
          >
            {editingCategory ? "Edit Category" : "Add Category"}
          </button>

          {showForm && (
            <form className="mb-6" onSubmit={handleFormSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <button
                className="w-full bg-blue-500 text-white p-2 rounded"
                type="submit"
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
            </form>
          )}
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories
          .filter((category) => category && category._id) // Filter out invalid items
          .map((category) => (
            <Tilt
              key={category._id}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable={true}
              glareMaxOpacity={0.5}
              className="border rounded-lg shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
            >
              <Link to={`/categories/${category._id}/products`}>
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl text-blue-500 hover:underline cursor-pointer">
                    {category.name}
                  </h3>
                  <p>{category.description}</p>
                </div>
              </Link>
              {user && user.isAdmin && (
                <div className="flex space-x-2 mt-2">
                  <button
                    className="flex items-center bg-yellow-500 text-white p-2 rounded"
                    onClick={() => handleEditCategory(category)}
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex items-center bg-red-500 text-white p-2 rounded"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    <FaTrashAlt className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </Tilt>
          ))}
      </div>
    </div>
  );
};

export default CategoryList;
