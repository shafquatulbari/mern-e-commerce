import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../common/BackButton";
import Tilt from "react-parallax-tilt"; // Import React Tilt
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import React Icons

const ManufacturerList = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // State for image URL
  const [error, setError] = useState("");
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchManufacturers = async () => {
    try {
      const response = await api.get("manufacturers/");
      setManufacturers(response.data || []); // Ensure array is not null
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const handleAddManufacturer = () => {
    setEditingManufacturer(null);
    setName("");
    setDescription("");
    setImage(""); // Reset image field
    setShowForm(true);
  };

  const handleEditManufacturer = (manufacturer) => {
    setEditingManufacturer(manufacturer);
    setName(manufacturer.name);
    setDescription(manufacturer.description);
    setImage(manufacturer.image); // Set image URL for editing
    setShowForm(true);
  };

  const handleDeleteManufacturer = async (manufacturerId) => {
    try {
      await api.delete(`manufacturers/${manufacturerId}/`);
      setManufacturers(
        manufacturers.filter((man) => man._id !== manufacturerId)
      );
    } catch (error) {
      setError("Failed to delete manufacturer");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingManufacturer) {
        // Update existing manufacturer
        const response = await api.put(
          `manufacturers/${editingManufacturer._id}/`,
          {
            name,
            description,
            image, // Include image URL
          }
        );
        const updatedManufacturers = manufacturers.map((man) =>
          man._id === editingManufacturer._id ? response.data : man
        );
        setManufacturers(updatedManufacturers);
      } else {
        // Add a new manufacturer
        const response = await api.post("manufacturers/", {
          name,
          description,
          image, // Include image URL
        });
        setManufacturers([...manufacturers, response.data]);
      }
      setName("");
      setDescription("");
      setImage(""); // Reset image field
      setEditingManufacturer(null);
      setShowForm(false);
    } catch (err) {
      setError("Failed to save manufacturer");
    }
  };

  return (
    <div className="p-6">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">Manufacturers</h1>

      {user && user.isAdmin && (
        <>
          <button
            className="bg-green-500 text-white p-2 rounded mb-4"
            onClick={handleAddManufacturer}
          >
            {editingManufacturer ? "Edit Manufacturer" : "Add Manufacturer"}
          </button>

          {showForm && (
            <form className="mb-6" onSubmit={handleFormSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <input
                type="text"
                placeholder="Manufacturer Name"
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
                {editingManufacturer
                  ? "Update Manufacturer"
                  : "Add Manufacturer"}
              </button>
            </form>
          )}
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manufacturers
          .filter((manufacturer) => manufacturer && manufacturer._id) // Filter out invalid items
          .map((manufacturer) => (
            <Tilt
              key={manufacturer._id}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable={true}
              glareMaxOpacity={0.5}
              className="border p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            >
              <Link to={`/manufacturers/${manufacturer._id}/products`}>
                <h3 className="text-xl text-blue-500 hover:underline cursor-pointer">
                  {manufacturer.name}
                </h3>
                <p>{manufacturer.description}</p>
                {manufacturer.image && (
                  <img
                    src={manufacturer.image}
                    alt={manufacturer.name}
                    className="w-60 h-40 object-cover rounded mt-2"
                  />
                )}
              </Link>

              {user && user.isAdmin && (
                <div className="flex space-x-2 mt-2">
                  <button
                    className="flex items-center bg-yellow-500 text-white p-2 rounded"
                    onClick={() => handleEditManufacturer(manufacturer)}
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    className="flex items-center bg-red-500 text-white p-2 rounded"
                    onClick={() => handleDeleteManufacturer(manufacturer._id)}
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

export default ManufacturerList;
