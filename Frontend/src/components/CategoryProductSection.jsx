import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";

const CategoryProductSection = ({
    title,
    banner,
    tabs,
    defaultTab,
    fetchProducts,
    onViewAll
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchProducts(activeTab);
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, fetchProducts]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <section
            className="py-10 px-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        {title}
                    </h2>
                    <nav className="flex gap-2 flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab
                                    ? "bg-pink-700 text-white shadow-md"
                                    : "bg-white text-gray-700 border border-pink-600 hover:bg-pink-50"
                                    }`}
                                aria-label={`Chọn danh mục ${tab}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Banner */}
                    <aside className="hidden md:block">
                        <img
                            src={banner}
                            alt={title}
                            className="w-full rounded-lg shadow-md object-cover"
                            loading="lazy"
                            onError={(e) =>
                                (e.target.src = "https://via.placeholder.com/300?text=Banner")
                            }
                        />
                    </aside>

                    {/* Product List */}
                    <main className="md:col-span-4">
                        {isLoading ? (
                            <div
                                className="text-center py-10 text-gray-400"
                                role="status"
                                aria-live="polite"
                            >
                                Đang tải...
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[15px]">
                                {products.map((product) => (
                                    <ProductCard key={product.ProductID} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-20" role="alert">
                                <p className="text-lg">Không tìm thấy sản phẩm nào.</p>
                            </div>
                        )}
                    </main>
                </div>

                {/* View More */}
                <div className="text-center mt-10">
                    <button
                        onClick={() => onViewAll(activeTab)}
                        className="px-10 py-2 rounded-full text-sm font-semibold text-white bg-pink-700 hover:bg-gradient-to-r hover:from-pink-700 hover:to-pink-500 hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-lg uppercase"
                        aria-label={`Xem tất cả sản phẩm trong danh mục ${activeTab}`}
                    >
                        Xem tất cả
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CategoryProductSection;
