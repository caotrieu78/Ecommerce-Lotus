import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import CartService from "../services/CartService";
import { CartContext } from "../context/CartContext";
import Swal from "sweetalert2";
import { getUser } from "../services/authService";
import ProductCard from "../components/ProductCard";
import ProductService from "../services/productService";

const Shop = () => {
    const { addToCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(20);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);
    const [sortOrder, setSortOrder] = useState("default");
    const [brandList, setBrandList] = useState([]); // Sẽ được trích xuất từ seller.FullName
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(""); // State cho thanh tìm kiếm
    const categoryFromUrl = searchParams.get("category");
    console.log("Category from URL:", categoryFromUrl); // Debug: Kiểm tra tham số category

    const priceRanges = [
        { label: "Dưới 100.000đ", id: "under100k", min: 0, max: 100000 },
        { label: "100.000đ - 300.000đ", id: "100k-300k", min: 100000, max: 300000 },
        { label: "300.000đ - 500.000đ", id: "300k-500k", min: 300000, max: 500000 },
        { label: "Trên 500.000đ", id: "over500k", min: 500000, max: Infinity }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy danh sách sản phẩm
                const productData = await ProductService.getAll();
                console.log("Raw product data from ProductService:", productData); // Debug: Kiểm tra dữ liệu thô
                const enriched = productData.map((product) => {
                    // Ánh xạ danh mục dựa trên tên sản phẩm (chỉ để gán Category, không dùng để lọc)
                    let category = "Tất cả sản phẩm";
                    if (
                        product.ProductName.includes("Morinaga") ||
                        product.ProductName.includes("Hagukumi") ||
                        product.ProductName.includes("Chilmil")
                    ) {
                        category = "Mẹ và bé";
                    } else if (
                        product.ProductName.includes("Ba rọi") ||
                        product.ProductName.includes("Chả cá") ||
                        product.ProductName.includes("Cá hồi") ||
                        product.ProductName.includes("Bánh tôm") ||
                        product.ProductName.includes("Cà chua")
                    ) {
                        category = "Thực phẩm";
                    } else if (
                        product.ProductName.includes("ReFa") ||
                        product.ProductName.includes("Khăn lau kính")
                    ) {
                        category = "Hóa mỹ phẩm";
                    } else if (
                        product.ProductName.includes("Lõi lọc nước") ||
                        product.ProductName.includes("Torayvino")
                    ) {
                        category = "Nhà cửa đời sống";
                    }

                    const variants = product.Variants || [];
                    const sorted = variants.length
                        ? [...variants].sort((a, b) => (a.Price || 0) - (b.Price || 0))
                        : [];
                    const defaultVariant =
                        sorted.length > 0
                            ? sorted[0]
                            : { Price: product.Price || 0, VariantID: product.ProductID }; // Fallback to ProductID
                    return {
                        ...product,
                        SelectedVariant: defaultVariant,
                        Category: category // Thêm trường Category để tham chiếu
                    };
                });
                console.log("Enriched products with categories:", enriched); // Debug: Kiểm tra dữ liệu sau khi làm giàu

                // Trích xuất danh sách thương hiệu từ seller.FullName
                const productBrands = [
                    ...new Set(
                        enriched
                            .map((product) => product.seller?.FullName)
                            .filter((brand) => brand && brand.trim() !== "")
                    )
                ];
                console.log(
                    "Extracted brand list from seller.FullName:",
                    productBrands
                ); // Debug: Kiểm tra danh sách thương hiệu
                setBrandList(productBrands.length > 0 ? productBrands : ["Unknown"]); // Fallback nếu không có thương hiệu

                setProducts(enriched);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Không thể tải dữ liệu. Vui lòng thử lại!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Loại bỏ handleAddToCart vì sẽ xử lý trong ProductDetail
    const filterByBrand = (product) => {
        if (selectedBrands.length === 0) return true;
        const productBrand = product.seller?.FullName || ""; // Sử dụng seller.FullName thay vì Brand
        return selectedBrands.includes(productBrand) || !productBrand;
    };

    const filterByPrice = (product) => {
        if (selectedPrices.length === 0) return true;
        const price = product.SelectedVariant.Price || 0;
        return selectedPrices.some((rangeId) => {
            const rangeObj = priceRanges.find((r) => r.id === rangeId);
            return (
                price >= rangeObj.min &&
                (rangeObj.max === Infinity ? price <= 1000000 : price < rangeObj.max)
            );
        });
    };

    const filterBySearch = (product) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            product.ProductName.toLowerCase().includes(query) ||
            product.seller?.FullName?.toLowerCase().includes(query) ||
            false
        );
    };

    const resetFilters = () => {
        setSelectedBrands([]);
        setSelectedPrices([]);
        setSortOrder("default");
        setSearchQuery("");
    };

    const toggleBrand = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    const togglePrice = (rangeId) => {
        setSelectedPrices((prev) =>
            prev.includes(rangeId)
                ? prev.filter((id) => id !== rangeId)
                : [...prev, rangeId]
        );
    };

    const sortProducts = (products) => {
        if (sortOrder === "price-asc") {
            return [...products].sort(
                (a, b) =>
                    (a.SelectedVariant.Price || 0) - (b.SelectedVariant.Price || 0)
            );
        } else if (sortOrder === "price-desc") {
            return [...products].sort(
                (a, b) =>
                    (b.SelectedVariant.Price || 0) - (a.SelectedVariant.Price || 0)
            );
        }
        return products;
    };

    const filteredProducts = products
        .filter(filterByBrand)
        .filter(filterByPrice)
        .filter(filterBySearch);
    console.log("Filtered products:", filteredProducts); // Debug: Kiểm tra sản phẩm sau khi lọc
    const sortedProducts = sortProducts(filteredProducts);
    const visibleProducts = sortedProducts.slice(0, visibleCount);

    return (
        <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen py-12 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">
                {/* Sidebar */}
                <aside className="w-full lg:w-1/4 space-y-6 lg:sticky lg:top-24 transition-all duration-300">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="font-bold text-xl text-gray-900">
                                Bộ lọc sản phẩm
                            </h3>
                            {(selectedBrands.length > 0 ||
                                selectedPrices.length > 0 ||
                                searchQuery) && (
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                )}
                        </div>
                        <ul className="text-sm text-gray-600 space-y-4">
                            <li className="hover:text-pink-600 cursor-pointer transition-colors duration-200">
                                Sản phẩm khuyến mãi
                            </li>
                            <li className="hover:text-pink-600 cursor-pointer transition-colors duration-200">
                                Sản phẩm nổi bật
                            </li>
                            <li className="font-bold text-pink-600">Tất cả sản phẩm</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="font-bold text-xl text-gray-900 mb-5">
                            Nhà cung cấp
                        </h3>
                        {brandList.length > 0 ? (
                            brandList.map((brand, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center text-sm text-gray-700 mb-4"
                                >
                                    <input
                                        type="checkbox"
                                        className="mr-3 h-5 w-5 text-pink-600 focus:ring-pink-500 rounded border-gray-300"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => toggleBrand(brand)}
                                    />
                                    <span className="hover:text-pink-600 cursor-pointer transition-colors duration-200">
                                        {brand}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                Không có nhà cung cấp để hiển thị
                            </p>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="font-bold text-xl text-gray-900 mb-5">Lọc giá</h3>
                        {priceRanges.map((range) => (
                            <div
                                key={range.id}
                                className="flex items-center text-sm text-gray-700 mb-4"
                            >
                                <input
                                    type="checkbox"
                                    className="mr-3 h-5 w-5 text-pink-600 focus:ring-pink-500 rounded border-gray-300"
                                    checked={selectedBrands.includes(range.id)} // Lỗi ở đây: Sửa thành selectedPrices
                                    onChange={() => togglePrice(range.id)}
                                />
                                <span className="hover:text-pink-600 cursor-pointer transition-colors duration-200">
                                    {range.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main content */}
                <main className="w-full lg:w-3/4">
                    <img
                        src="/images/collection_banner.jpg"
                        alt="Banner"
                        className="rounded-2xl w-full mb-10 object-cover h-52 sm:h-64 lg:h-80 shadow-md"
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            {categoryFromUrl || "Tất cả sản phẩm"}
                        </h2>
                        <div className="flex items-center gap-4">
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="text-sm text-gray-600 border border-gray-300 rounded-md p-2 focus:ring-pink-500 focus:border-pink-500"
                            >
                                <option value="default">Sắp xếp: Mặc định</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                            </select>
                            <span className="text-sm text-gray-500">
                                {filteredProducts.length} sản phẩm
                            </span>
                        </div>
                    </div>

                    {/* Thanh tìm kiếm */}
                    <div className="mb-6">
                        <div className="relative w-full max-w-lg">
                            <input
                                type="text"
                                className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm bg-white shadow-md transition-all duration-300 placeholder-gray-400"
                                placeholder="Tìm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                                    onClick={() => setSearchQuery("")}
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20 text-gray-500 text-lg animate-pulse">
                            Đang tải sản phẩm...
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-20 text-lg">
                            {error}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {visibleProducts.map((product, index) => (
                                    <div
                                        key={product.ProductID}
                                        className="animate-fadeIn"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>

                            {visibleCount < filteredProducts.length && (
                                <div className="text-center mt-12">
                                    <button
                                        onClick={() => setVisibleCount((prev) => prev + 10)}
                                        className="px-10 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-md text-base font-medium hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-md"
                                    >
                                        Xem thêm sản phẩm
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Custom CSS for animations */}
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default Shop;
