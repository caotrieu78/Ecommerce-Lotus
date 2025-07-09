import React, { useState } from "react";
import {
    Heart,
    ShoppingCart,
    Trash2,
    Star,
    Filter,
    Grid,
    List
} from "lucide-react";

const Favorites = () => {
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
    const [filterCategory, setFilterCategory] = useState("all");
    const [favoriteProducts, setFavoriteProducts] = useState([
        {
            id: 1,
            name: "Bánh trứng Manna Bolo 36g",
            price: 68000,
            originalPrice: 85000,
            image:
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            rating: 4.8,
            reviewCount: 156,
            category: "Thực phẩm",
            brand: "MANNA",
            discount: 20,
            inStock: true
        },
        {
            id: 2,
            name: "Sữa tắm Dove 250ml",
            price: 450000,
            originalPrice: 520000,
            image:
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            rating: 4.5,
            reviewCount: 89,
            category: "Hóa mỹ phẩm",
            brand: "Dove",
            discount: 13,
            inStock: true
        },
        {
            id: 3,
            name: "Tã em bé Pampers L",
            price: 320000,
            originalPrice: 380000,
            image:
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            rating: 4.9,
            reviewCount: 234,
            category: "Mẹ và bé",
            brand: "Pampers",
            discount: 16,
            inStock: false
        },
        {
            id: 4,
            name: "Máy lọc không khí Xiaomi",
            price: 2890000,
            originalPrice: 3200000,
            image:
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80",
            rating: 4.7,
            reviewCount: 67,
            category: "Nhà cửa đời sống",
            brand: "Xiaomi",
            discount: 10,
            inStock: true
        }
    ]);

    const categories = [
        "all",
        "Thực phẩm",
        "Hóa mỹ phẩm",
        "Mẹ và bé",
        "Nhà cửa đời sống"
    ];

    const filteredProducts = favoriteProducts.filter(
        (product) => filterCategory === "all" || product.category === filterCategory
    );

    const removeFavorite = (productId) => {
        setFavoriteProducts((prev) =>
            prev.filter((product) => product.id !== productId)
        );
    };

    const addToCart = (product) => {
        console.log("Added to cart:", product);
        // Add to cart logic here
    };

    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-64">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                        -{product.discount}%
                    </div>
                )}

                {/* Remove Heart Button */}
                <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                    <Heart className="w-5 h-5 text-pink-500 fill-current" />
                </button>

                {/* Stock Status */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                            Hết hàng
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4">
                {/* Product Info */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{product.brand}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-pink-600">
                        {product.price.toLocaleString()}₫
                    </span>
                    {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice.toLocaleString()}₫
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                    </button>
                    <button
                        onClick={() => removeFavorite(product.id)}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-md"
                    >
                        <Trash2 className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );

    const ProductListItem = ({ product }) => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex gap-6">
                <div className="relative w-32 h-32">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl"
                    />
                    {product.discount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold shadow-md">
                            -{product.discount}%
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{product.brand}</span>
                                <span>•</span>
                                <span>{product.category}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => removeFavorite(product.id)}
                            className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
                        >
                            <Heart className="w-5 h-5 text-pink-500 fill-current" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(product.rating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
                            ({product.reviewCount})
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-pink-600">
                                {product.price.toLocaleString()}₫
                            </span>
                            {product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through">
                                    {product.originalPrice.toLocaleString()}₫
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className="bg-pink-600 text-white py-2 px-6 rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {product.inStock ? "Thêm vào giỏ" : "Hết hàng"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-4">
                        <Heart className="w-10 h-10 text-pink-500 fill-current" />
                        Sản phẩm yêu thích
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Danh sách các sản phẩm bạn đã lưu để mua sau
                    </p>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {favoriteProducts.length}
                                </div>
                                <div className="text-sm text-gray-600">Sản phẩm</div>
                            </div>
                            <div className="w-px h-16 bg-gray-200"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {favoriteProducts.filter((p) => p.inStock).length}
                                </div>
                                <div className="text-sm text-gray-600">Còn hàng</div>
                            </div>
                            <div className="w-px h-16 bg-gray-200"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-pink-600">
                                    {categories.length - 1}
                                </div>
                                <div className="text-sm text-gray-600">Danh mục</div>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-3 rounded-lg transition-colors ${viewMode === "grid"
                                    ? "bg-white shadow-md"
                                    : "hover:bg-gray-200"
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-3 rounded-lg transition-colors ${viewMode === "list"
                                    ? "bg-white shadow-md"
                                    : "hover:bg-gray-200"
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-10">
                    <Filter className="w-6 h-6 text-gray-600" />
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setFilterCategory(category)}
                                className={`px-5 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${filterCategory === category
                                    ? "bg-pink-600 text-white shadow-md"
                                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {category === "all" ? "Tất cả" : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Chưa có sản phẩm yêu thích
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Hãy thêm sản phẩm vào danh sách yêu thích để xem tại đây
                        </p>
                        <button className="bg-pink-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors shadow-lg">
                            Khám phá sản phẩm
                        </button>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                                : "space-y-6"
                        }
                    >
                        {filteredProducts.map((product) =>
                            viewMode === "grid" ? (
                                <ProductCard key={product.id} product={product} />
                            ) : (
                                <ProductListItem key={product.id} product={product} />
                            )
                        )}
                    </div>
                )}

                {/* Quick Actions */}
                {filteredProducts.length > 0 && (
                    <div className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-5">
                            Thao tác nhanh
                        </h3>
                        <div className="flex gap-4">
                            <button className="bg-pink-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors flex items-center gap-2 shadow-md">
                                <ShoppingCart className="w-5 h-5" />
                                Thêm tất cả vào giỏ
                            </button>
                            <button className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-md">
                                <Trash2 className="w-5 h-5" />
                                Xóa tất cả
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
