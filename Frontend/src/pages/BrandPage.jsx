import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SellerService from "../services/SellerService";
import {
    ShoppingCart,
    Heart,
    Eye,
    Star,
    Package,
    Users,
    Award,
    TrendingUp,
} from "lucide-react";
import ProductService from "../services/productService";

const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(Number(price)) + "đ";

const BrandPage = () => {
    const { id } = useParams(); // ✅ lấy SellerID từ URL
    const [brandInfo, setBrandInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(20);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrandAndProducts = async () => {
            setLoading(true);
            try {
                const seller = await SellerService.getById(id); // ✅ lấy nhãn hàng theo id
                const allProducts = await ProductService.getAll();

                const sellerProducts = allProducts.filter(
                    (product) => product.SellerID === id
                );

                setBrandInfo({
                    name: seller.StoreName,
                    description: seller.Description,
                    logo: seller.LogoURL,
                    banner: "/images/default-banner.jpg",
                    established: "2020",
                    followers: "12.5K",
                    rating: 4.8,
                });

                setProducts(sellerProducts);
            } catch (error) {
                console.error("Không thể tải thông tin nhãn hàng:", error);
                setBrandInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBrandAndProducts();
    }, [id]);

    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden border border-pink-100">
            <div className="relative overflow-hidden">
                <img
                    src={product.ThumbnailURL}
                    alt={product.ProductName}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition-colors">
                        <Heart className="w-3 h-3 text-gray-600 hover:text-pink-500" />
                    </button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="flex-1 bg-white text-gray-800 py-1.5 px-2 rounded-md text-xs font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        Xem
                    </button>
                    <button
                        onClick={() => console.log("Thêm vào giỏ:", product)}
                        className="flex-1 bg-pink-500 text-white py-1.5 px-2 rounded-md text-xs font-medium hover:bg-pink-600 transition-colors flex items-center justify-center gap-1"
                    >
                        <ShoppingCart className="w-3 h-3" />
                        Mua
                    </button>
                </div>
            </div>
            <div className="p-3">
                <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 text-sm">{product.ProductName}</h3>
                <div className="flex items-center gap-1 mb-1">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">(100)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-pink-600 font-bold text-sm">{formatPrice(product.Price)}</span>
                </div>
            </div>
        </div>
    );

    const visibleProducts = products.slice(0, visibleCount);

    return (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {brandInfo ? (
                    <>
                        {/* Banner */}
                        <div className="relative rounded-xl overflow-hidden shadow-sm mb-6">
                            <div
                                className="h-48 bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.8), rgba(236, 72, 153, 0.8)), url(${brandInfo.banner})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="text-center text-white">
                                    <img
                                        src={brandInfo.logo}
                                        alt={brandInfo.name}
                                        className="h-16 mx-auto mb-3 bg-white rounded-lg p-2"
                                    />
                                    <h1 className="text-3xl font-bold mb-2">{brandInfo.name}</h1>
                                    <p className="text-pink-100 max-w-2xl">{brandInfo.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { icon: <Package />, label: "Sản phẩm", value: products.length },
                                { icon: <Users />, label: "Người theo dõi", value: brandInfo.followers },
                                { icon: <Award />, label: "Đánh giá", value: brandInfo.rating },
                                { icon: <TrendingUp />, label: "Thành lập", value: brandInfo.established },
                            ].map(({ icon, label, value }, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 text-center border border-pink-100">
                                    <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mx-auto mb-2">
                                        {React.cloneElement(icon, { className: "w-6 h-6 text-pink-600" })}
                                    </div>
                                    <div className="text-2xl font-bold text-gray-800">{value}</div>
                                    <div className="text-sm text-gray-600">{label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Products */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Sản phẩm của {brandInfo.name}
                                </h2>
                                <span className="text-sm text-gray-600 bg-pink-50 px-3 py-1 rounded-full">
                                    {products.length} sản phẩm
                                </span>
                            </div>

                            {loading ? (
                                <div className="text-center py-16">Đang tải...</div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-16 text-gray-500">Không có sản phẩm nào</div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {visibleProducts.map((product) => (
                                            <ProductCard key={product.ProductID} product={product} />
                                        ))}
                                    </div>
                                    {visibleCount < products.length && (
                                        <div className="text-center mt-6">
                                            <button
                                                onClick={() => setVisibleCount((prev) => prev + 20)}
                                                className="px-6 py-2 border border-pink-500 text-pink-600 rounded hover:bg-pink-500 hover:text-white transition"
                                            >
                                                Xem thêm
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 text-gray-500">Không tìm thấy nhãn hàng</div>
                )}
            </div>
        </div>
    );
};

export default BrandPage;
