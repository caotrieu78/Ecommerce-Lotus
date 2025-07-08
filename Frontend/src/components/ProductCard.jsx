import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/paths";
import { FaShoppingBag, FaImage } from "react-icons/fa";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

const ProductCard = ({ product, onQuickView }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Memoized computed values
    const productImage = useMemo(() => {
        return imageError ? PLACEHOLDER_IMAGE : (product.ThumbnailURL || PLACEHOLDER_IMAGE);
    }, [product.ThumbnailURL, imageError]);

    const productPrice = useMemo(() => {
        return parseFloat(product.SelectedVariant?.Price || product.Price || 0);
    }, [product.SelectedVariant?.Price, product.Price]);

    const formattedPrice = useMemo(() => {
        return productPrice.toLocaleString("vi-VN");
    }, [productPrice]);

    const sellerName = useMemo(() => {
        return product.seller?.FullName?.toUpperCase() || null;
    }, [product.seller?.FullName]);

    // Event handlers
    const handleQuickView = useCallback(() => {
        if (product.ProductID) {
            if (onQuickView) {
                onQuickView(product);
            } else {
                navigate(`${PATHS.PRODUCTDETAIL}/${product.ProductID}`);
            }
        }
    }, [product, onQuickView, navigate]);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return (
        <article
            className="w-full bg-white rounded-xl border border-gray-100 shadow hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
            style={{ height: "320px" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleQuickView}
        >
            {/* Product Image */}
            <div className="bg-white p-3 flex justify-center items-center relative overflow-hidden" style={{ height: "180px" }}>
                {imageError ? (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <FaImage className="text-gray-400 text-2xl" />
                    </div>
                ) : (
                    <img
                        src={productImage}
                        alt={product.ProductName}
                        className="h-full w-full object-contain transform transition-transform duration-300 group-hover:scale-105"
                        onError={handleImageError}
                        loading="lazy"
                    />
                )}

                {/* Brand Badge - positioned better */}
                {sellerName && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                        <span className="text-xs font-medium text-gray-600">
                            {sellerName}
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="px-3 pb-3 flex flex-col justify-between flex-1">
                {/* Product Name */}
                <h3
                    className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight"
                    title={product.ProductName}
                    style={{ minHeight: "36px" }}
                >
                    {product.ProductName}
                </h3>

                {/* Price */}
                <p className="text-pink-600 font-bold text-lg mb-3">
                    {formattedPrice}₫
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={handleQuickView}
                    className={`flex items-center justify-center gap-2 w-full text-sm py-2.5 rounded-full transition-all duration-200 font-medium ${isHovered
                        ? "bg-pink-700 text-white shadow-md transform scale-105"
                        : "bg-pink-600 text-white hover:bg-pink-700"
                        }`}
                    aria-label={`Thêm ${product.ProductName} vào giỏ hàng`}
                >
                    <span>THÊM VÀO GIỎ</span>
                    <FaShoppingBag className="text-base" />
                </button>
            </div>
        </article>
    );
};

export default ProductCard;