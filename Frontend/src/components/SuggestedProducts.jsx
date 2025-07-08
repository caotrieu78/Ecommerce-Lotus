import React, { useEffect, useState } from "react";
import ProductService from "../services/ProductService";
import ProductCard from "./ProductCard";

const SuggestedProducts = ({ title = "Bạn có thể thích", limit = 0 }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await ProductService.getAll();
                const rawProducts = Array.isArray(response) ? response : response?.data || [];
                const data = limit > 0 ? rawProducts.slice(0, limit) : rawProducts;
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm gợi ý:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [limit]);

    return (
        <div className="w-full py-10 mb-12 ">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        {title}
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center text-gray-500 py-10">Đang tải...</div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.ProductID} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-10">
                        Không có sản phẩm nào.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuggestedProducts;
