import React, { useState, useEffect, useContext, useCallback } from "react";

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

    const brandList = ["GIN7", "POPN COOKIN", "MANNA", "MORINAGA", "CHUCHUBABY"];
    const priceRanges = [
        { label: "Dưới 100.000đ", id: "under100k", min: 0, max: 100000 },
        { label: "100.000đ - 300.000đ", id: "100k-300k", min: 100000, max: 300000 },
        { label: "300.000đ - 500.000đ", id: "300k-500k", min: 300000, max: 500000 },
        { label: "Trên 500.000đ", id: "over500k", min: 500000, max: Infinity },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ProductService.getAll();
                const enriched = data.map((product) => {
                    const sorted = product.Variants?.length
                        ? [...product.Variants].sort((a, b) => a.Price - b.Price)
                        : [];
                    return {
                        ...product,
                        SelectedVariant: sorted[0] || { Price: product.Price || 0 },
                    };
                });
                setProducts(enriched);
            } catch (err) {
                setError("Không thể tải sản phẩm. Vui lòng thử lại!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddToCart = useCallback(async (product) => {
        const user = getUser();
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "Vui lòng đăng nhập!",
                text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        try {
            await CartService.addItem(product.SelectedVariant.VariantID, 1);
            addToCart(product.SelectedVariant, 1);
            Swal.fire({
                icon: "success",
                title: "Thành công!",
                text: `${product.ProductName} đã được thêm vào giỏ hàng!`,
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: "Không thể thêm vào giỏ hàng.",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    }, [addToCart]);

    const filterByBrand = (product) => {
        if (selectedBrands.length === 0) return true;
        return selectedBrands.includes(product.Brand);
    };

    const filterByPrice = (product) => {
        if (selectedPrices.length === 0) return true;
        return selectedPrices.some(range => {
            const price = product.SelectedVariant.Price;
            const rangeObj = priceRanges.find(r => r.id === range);
            return price >= rangeObj.min && price < rangeObj.max;
        });
    };

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const togglePrice = (rangeId) => {
        setSelectedPrices(prev =>
            prev.includes(rangeId) ? prev.filter(id => id !== rangeId) : [...prev, rangeId]
        );
    };

    const filteredProducts = products.filter(p => filterByBrand(p) && filterByPrice(p));
    const visibleProducts = filteredProducts.slice(0, visibleCount);

    return (
        <div className="bg-[#f7f4ee] min-h-screen">
            <div className="max-w-[1300px] mx-auto px-4 py-6 flex gap-6">
                {/* Sidebar */}
                <aside className="w-1/4 space-y-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold mb-2">Danh mục sản phẩm</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>Sản phẩm khuyến mãi</li>
                            <li>Sản phẩm nổi bật</li>
                            <li className="font-bold text-pink-500">Tất cả sản phẩm</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold mb-2">Nhà cung cấp</h3>
                        {brandList.map((brand, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                />
                                {brand}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold mb-2">Lọc giá</h3>
                        {priceRanges.map((range) => (
                            <div key={range.id} className="text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedPrices.includes(range.id)}
                                    onChange={() => togglePrice(range.id)}
                                />
                                {range.label}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main content */}
                <main className="w-3/4">
                    <img
                        src="/images/collection_banner.jpg"
                        alt="Banner"
                        className="rounded-lg w-full mb-4 object-cover h-52"
                    />

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Mẹ và Bé</h2>
                        <span className="text-sm text-gray-600">{filteredProducts.length} sản phẩm</span>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-10">{error}</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {visibleProducts.map((product) => (
                                    <ProductCard
                                        key={product.ProductID}
                                        product={product}
                                        onQuickView={() => handleAddToCart(product)}
                                    />
                                ))}
                            </div>

                            {visibleCount < filteredProducts.length && (
                                <div className="text-center mt-6">
                                    <button
                                        onClick={() => setVisibleCount((prev) => prev + 10)}
                                        className="px-6 py-2 border-2 border-pink-500 text-pink-500 rounded-md hover:bg-pink-500 hover:text-white transition"
                                    >
                                        Xem thêm sản phẩm
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Shop;
