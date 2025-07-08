import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";
import ProductCard from "../../components/ProductCard";
import QuickViewModal from "../../components/QuickViewModal";

const CATEGORIES = [
    "Thực phẩm chế biến",
    "Thực phẩm tươi",
    "Thực phẩm ăn liền"
];

const DEFAULT_CATEGORY = "Thực phẩm chế biến";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(DEFAULT_CATEGORY);

    const navigate = useNavigate();

    // Utility function to enrich product data
    const enrichProductData = useCallback((products) => {
        return products.map(product => {
            const variant = product.Variants?.length
                ? [...product.Variants].sort((a, b) => a.Price - b.Price)[0]
                : { Price: product.Price || 0 };

            return {
                ...product,
                SelectedVariant: variant,
            };
        });
    }, []);

    // Fetch products with error handling
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await ProductService.getAll();
            const rawProducts = Array.isArray(response) ? response : response?.data || [];
            const enrichedProducts = enrichProductData(rawProducts);

            setProducts(enrichedProducts);
        } catch (err) {
            console.error("Error loading products:", err);
            setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    }, [enrichProductData]);

    // Initialize component
    useEffect(() => {
        fetchProducts();
        window.scrollTo(0, 0);
    }, [fetchProducts]);

    // Event handlers
    const handleQuickView = useCallback((product) => {
        setSelectedProduct(product);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    const handleViewMore = useCallback(() => {
        navigate("/shop");
    }, [navigate]);

    const handleTabChange = useCallback((category) => {
        setActiveTab(category);
    }, []);

    // Render loading state
    if (isLoading) {
        return (
            <div className="bg-[#fdfcfb] py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center text-gray-500 py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                        Đang tải sản phẩm...
                    </div>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="bg-[#fdfcfb] py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center text-red-500 py-20">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-lg mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className=" py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        Thực phẩm
                    </h2>

                    {/* Category Tabs */}
                    <nav className="flex gap-2 flex-wrap">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleTabChange(category)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === category
                                    ? "bg-pink-600 text-white shadow-md"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                    }`}
                                aria-pressed={activeTab === category}
                            >
                                {category}
                            </button>
                        ))}
                    </nav>
                </header>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Sidebar Banner */}
                    <aside className="hidden md:block">
                        <img
                            src="/images/home_coll_1_banner1.jpg"
                            alt="Khuyến mãi thực phẩm"
                            className="w-full rounded-lg shadow-md object-cover"
                            loading="lazy"
                        />
                    </aside>

                    {/* Products Grid */}
                    <main className="md:col-span-4">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[15px]">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.ProductID}
                                        product={product}
                                        onQuickView={handleQuickView}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-20">
                                <div className="text-4xl mb-4">📦</div>
                                <p className="text-lg">Không tìm thấy sản phẩm nào.</p>
                            </div>
                        )}
                    </main>
                </div>

                {/* View More Button */}
                <footer className="text-center mt-10">
                    <button
                        onClick={handleViewMore}
                        className="text-pink-600 border border-pink-500 hover:bg-pink-50 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
                    >
                        Xem tất cả <span className="font-bold">{activeTab}</span>
                    </button>
                </footer>

                {/* Quick View Modal */}
                {selectedProduct && (
                    <QuickViewModal
                        product={selectedProduct}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductList;