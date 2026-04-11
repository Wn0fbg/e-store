import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <>
      <Link
        key={product.id}
        to={`/product/${product.id}`}
        className="flex-shrink-0 w-80 glass-card hover:glow-on-hover animate-smooth group"
      >
        {/* Product image */}
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={"/avatar-holder.avif"}
            // src={product.images[0].url}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {new Date() - new Date(product.created_at) <
              30 * 24 * 60 * 60 * 1000 && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                NEW
              </span>
            )}
            {product.rating >= 4.5 && (
              <span
                className={`px-2 py-1 bg-gradient-to-r from-yellow-400 to-rose-500
                      text-white bg-primary text-primary-foreground text-xs font-semibold rounded`}
              >
                TOP RATED
              </span>
            )}
          </div>

          {/* Quick add to cart */}
          <button
            onClick={(e) => handleAddToCart(product, e)}
            className={`absolute bottom-3 right-3 p-2 glass-card hover:glow-on-hover 
                       animate-smooth opacity-0 group-hover:opacity-100 transition-opacity`}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="size-5 text-primary" />
          </button>
        </div>

        {/* Product info */}
        <div>
          {/* Product title */}
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Product rating */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                return (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                );
              })}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.review_count})
            </span>
          </div>

          {/* Product price */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">
              ${product.price}
            </span>
          </div>

          {/* Product availability */}
          <div>
            <span
              className={`px-2 py-2 pt-1 pb-1 rounded ${
                product.stock > 5
                  ? "bg-green-500/20 text-green-400"
                  : product.stock > 0
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {product.stock > 5
                ? "In stock"
                : product.stock > 0
                  ? "Limited stock"
                  : "Out of stock"}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
