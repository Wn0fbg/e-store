import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../store/slices/productSlice";

const Products = () => {
  const { products, totalProducts } = useSelector((state) => state.product);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const searchTerm = query.get("search");
  const searchedCategory = query.get("category");

  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchedCategory || "",
  );
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: selectedCategory,
        price: `${priceRange[0]}-${priceRange[1]}`,
        search: searchQuery,
        rating: selectedRating,
        availability: availability,
        page: currentPage,
      }),
    );
  }, [
    dispatch,
    selectedCategory,
    priceRange,
    searchQuery,
    selectedRating,
    availability,
    currentPage,
  ]);

  const totalPages = Math.ceil(totalProducts / 10);

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className={`lg:hidden mb-4 p-3 glass-card hover:glow-on-hover
              animate-smooth flex items-center space-x-2`}
            >
              <Filter className="size-5" />
              <span>Filters</span>
            </button>

            {/* Sidebar filters */}
            <div
              className={`lg:block ${
                isMobileFilterOpen ? "block" : "hidden"
              } w-full lg:w-80 space-x-6`}
            >
              <div className="glass-panel">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Filters
                </h2>

                {/* Price range */}
                <div className="mb-6">
                  <h3 className="rext-lg font-medium text-foreground mb-3">
                    Price range
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
