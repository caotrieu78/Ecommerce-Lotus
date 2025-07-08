import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";

const CategoryProductSection = ({ title, banner, tabs, defaultTab, fetchProducts, onViewAll }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadProducts = useCallback(async () => {
        setIsLoading(true);
        const data = await fetchProducts(activeTab);
        setProducts(data);
        setIsLoading(false);
    }, [activeTab, fetchProducts]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return (
        <section className="py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
                    <nav className="flex gap-2 flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab
                                    ? "bg-pink-600 text-white shadow-md"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                    }`}
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
                        />
                    </aside>

                    {/* Product List */}
                    <main className="md:col-span-4">
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-400">Đang tải...</div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[15px]">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.ProductID}
                                        product={product}
                                        onQuickView={setSelectedProduct}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-20">
                                <p className="text-lg">Không tìm thấy sản phẩm nào.</p>
                            </div>
                        )}
                    </main>
                </div>

                {/* View More */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => onViewAll(activeTab)}
                        className="text-pink-600 border border-pink-500 hover:bg-pink-50 px-6 py-2 rounded-full text-sm font-semibold transition"
                    >
                        Xem tất cả <span className="font-bold">{activeTab}</span>
                    </button>
                </div>

                {/* Quick View */}
                {selectedProduct && (
                    <QuickViewModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </div>
        </section>
    );
};

export default CategoryProductSection;
