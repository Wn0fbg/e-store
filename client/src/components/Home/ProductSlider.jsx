import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductSlider = ({ title, products }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scroll.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const dispatch = useDispatch();
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  return (
    <>
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              className="py-2 glass-card hover:glow-on-hover animate-smooth"
            >
              <ChevronLeft className="size-6 text-primary" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="py-2 glass-card hover:glow-on-hover animate-smooth"
            >
              <ChevronRight className="size-6 text-primary" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
        >
          {products.map((product) => {
            return (
              <Link
                key={product.direction}
                to={`/product/${product.id}`}
                className="flex-shrink-0 w-80 glass-card hover:glow-on-hover animate-smooth group"
              >
                {/* Product image */}
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-48  object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ProductSlider;
