import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Star, Filter, Grid, List } from 'lucide-react';

const Favorites = () => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterCategory, setFilterCategory] = useState('all');
    const [favoriteProducts, setFavoriteProducts] = useState([
        {
            id: 1,
            name: "Bánh trứng Manna Bolo 36g",
            price: 68000,
            originalPrice: 85000,
            image: "/api/placeholder/300/300",
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
            image: "/api/placeholder/300/300",
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
            image: "/api/placeholder/300/300",
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
            image: "/api/placeholder/300/300",
            rating: 4.7,
            reviewCount: 67,
            category: "Nhà cửa đời sống",
            brand: "Xiaomi",
            discount: 10,
            inStock: true
        }
    ]);

    const categories = ['all', 'Thực phẩm', 'Hóa mỹ phẩm', 'Mẹ và bé', 'Nhà cửa đời sống'];

    const filteredProducts = favoriteProducts.filter(product =>
        filterCategory === 'all' || product.category === filterCategory
    );

    const removeFavorite = (productId) => {
        setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
    };

    const addToCart = (product) => {
        console.log('Added to cart:', product);
        // Add to cart logic here
    };

    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{product.discount}%
                    </div>
                )}

                {/* Remove Heart Button */}
                <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                    <Heart className="w-4 h-4 text-pink-500 fill-current" />
                </button>

                {/* Stock Status */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                            Hết hàng
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 space-y-3">
                {/* Product Info */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{product.brand}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-pink-600">{product.price.toLocaleString()}₫</span>
                    {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}₫</span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                    <button
                        onClick={() => removeFavorite(product.id)}
                        className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );

    const ProductListItem = ({ product }) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300">
            <div className="flex gap-4">
                <div className="relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-xl"
                    />
                    {product.discount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                            -{product.discount}%
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{product.brand}</span>
                                <span>•</span>
                                <span>{product.category}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => removeFavorite(product.id)}
                            className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            <Heart className="w-4 h-4 text-pink-500 fill-current" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.reviewCount})</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-pink-600">{product.price.toLocaleString()}₫</span>
                            {product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}₫</span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={!product.inStock}
                                className="bg-pink-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                        <Heart className="w-8 h-8 text-pink-500 fill-current" />
                        Sản phẩm yêu thích
                    </h1>
                    <p className="text-gray-600">Danh sách các sản phẩm bạn đã lưu để mua sau</p>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{favoriteProducts.length}</div>
                                <div className="text-sm text-gray-600">Sản phẩm</div>
                            </div>
                            <div className="w-px h-12 bg-gray-200"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{favoriteProducts.filter(p => p.inStock).length}</div>
                                <div className="text-sm text-gray-600">Còn hàng</div>
                            </div>
                            <div className="w-px h-12 bg-gray-200"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-pink-600">{categories.length - 1}</div>
                                <div className="text-sm text-gray-600">Danh mục</div>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-8">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <div className="flex gap-2 overflow-x-auto">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setFilterCategory(category)}
                                className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap ${filterCategory === category
                                        ? 'bg-pink-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {category === 'all' ? 'Tất cả' : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có sản phẩm yêu thích</h3>
                        <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào danh sách yêu thích để xem tại đây</p>
                        <button className="bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors">
                            Khám phá sản phẩm
                        </button>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
                        {filteredProducts.map(product => (
                            viewMode === 'grid' ? (
                                <ProductCard key={product.id} product={product} />
                            ) : (
                                <ProductListItem key={product.id} product={product} />
                            )
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                {filteredProducts.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
                        <div className="flex gap-4">
                            <button className="bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                Thêm tất cả vào giỏ
                            </button>
                            <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
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