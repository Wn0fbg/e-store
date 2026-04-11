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
import { fetchAllProducts } from "../store/slices/productSlice";

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
    dispatch(fetchAllProducts(id));
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
        <loading className="size-10 animate-spin" />
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
                    className="w-full h-96 object-contain rounded-lg"
                  />
                ) : (
                  <div className="glass-card min-h-[418px] p-4 mb-4 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
