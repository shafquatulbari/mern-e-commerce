import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock_level}</p>
      <p>Category: {product.category.name}</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;
