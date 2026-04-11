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
                <div className="mb-6">
                  <h3 className="rext-lg font-medium text-foreground mb-3">
                    Rating
                  </h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => {
                      return (
                        <button
                          key={rating}
                          onClick={() =>
                            setSelectedCategory(
                              selectedRating === rating ? 0 : rating,
                            )
                          }
                          className={`flex items-center space-x-2 w-full p-2 rounded ${
                            selectedRating === rating
                              ? "bg-primary/20"
                              : "hover:bg-secondary"
                          } `}
                        >
                          {[...Array(5)].map((_, i) => {
                            return (
                              <Star
                                key={i}
                                className={`size-4 ${
                                  i < rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            );
                          })}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <h3 className="rext-lg font-medium text-foreground mb-3">
                    Availability
                  </h3>
                  <div className="space-y-2">
                    {["in-stock", "limited", "out-of-stock"].map((status) => {
                      return (
                        <button
                          key={status}
                          onClick={() =>
                            setAvailability(
                              availability === status ? "" : status,
                            )
                          }
                          className={`w-full p-2 text-left rounded ${
                            availability === status
                              ? "bg-primary/20"
                              : "hover:bg-secondary"
                          }`}
                        >
                          {status === "in-stock"
                            ? "In stock"
                            : status === "limited"
                              ? "Limited stock"
                              : "Out of stock"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <h3 className="rext-lg font-medium text-foreground mb-3">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full p-2 text-left rounded ${
                        !selectedCategory
                          ? "bg-primary/20"
                          : "hover:bg-secondary"
                      }`}
                    >
                      All categories
                    </button>
                    {categories.map((category) => {
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full p-2 text-left rounded ${
                          selectedCategory === category.name
                            ? "bg-primary/20"
                            : "hover:bg-secondary"
                        }`}
                      >
                        {category.name}
                      </button>;
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              {/* Search bar */}
              <div className="mb-8 flex max-[440px]:flex-col items-center gap-2">
                <div className="relative w-[-webkit-fill-available]">
                  <Search
                    className={`absolute left-3 top-1/2 transform 
                      -translate-y-1/2 size-5 text-muted-foreground`}
                  />
                  <input
                    type="text"
                    placeholder="Search Products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-secondary border border-border
                        rounded-lg focus:outline-none text-foreground placeholder-muted-foreground`}
                  />
                </div>
                <button></button>
              </div>

              {/* Products grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {products.map((product) => {
                  <ProductCard key={product.id} product={product} />;
                })}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}

              {/* No results */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
