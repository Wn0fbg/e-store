import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import { addToCart } from "../store/slices/cartSlice";
import { fetchProductDetails } from "../store/slices/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product?.productDetails);
  const { loading, productReviews } = useSelector((state) => state.product);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground">
            The product you're looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="glass-card p-4 mb-4">
                {product.images ? (
                  <img
                    src={"/avatar-holder.avif"}
                    // src={product.images[selectedImage]?.url}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="glass-card min-h-[418px] p-4 mb-4 animate-pulse" />
                )}
              </div>
              <div>
                {product.images &&
                  product?.images.map((image, index) => {
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`size-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={"/avatar-holder.avif"}
                          // src={image?.url}
                          // alt={`${product.name} ${index + 1}`}
                          className="w-full h-full"
                        />
                      </button>
                    );
                  })}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <div className="flex space-x-2 mb-4">
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
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
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
                  <span className="text-foreground font-medium">
                    {product.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({productReviews?.length}) reviews
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
