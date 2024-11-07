import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../common/BackButton";

const ManufacturerList = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchManufacturers = async () => {
    try {
      const response = await api.get("manufacturers/");
      setManufacturers(response.data);
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const handleAddManufacturer = () => {
    setEditingManufacturer(null);
    setShowForm(true);
  };

  const handleEditManufacturer = (manufacturer) => {
    setEditingManufacturer(manufacturer);
    setName(manufacturer.name);
    setDescription(manufacturer.description);
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
        });
        setManufacturers([...manufacturers, response.data]);
      }
      setName("");
      setDescription("");
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

      <div>
        {manufacturers.map((manufacturer) => (
          <div key={manufacturer._id} className="border p-4 mb-2 rounded">
            <Link to={`/manufacturers/${manufacturer._id}/products`}>
              <h3 className="text-xl text-blue-500 hover:underline cursor-pointer">
                {manufacturer.name}
              </h3>
            </Link>
            <p>{manufacturer.description}</p>
            {user && user.isAdmin && (
              <>
                <button
                  className="bg-yellow-500 text-white p-2 rounded mt-2 mr-2"
                  onClick={() => handleEditManufacturer(manufacturer)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded mt-2"
                  onClick={() => handleDeleteManufacturer(manufacturer._id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManufacturerList;
