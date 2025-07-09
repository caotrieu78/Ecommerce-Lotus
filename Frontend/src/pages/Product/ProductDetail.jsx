import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    Shield,
    Clock,
    RotateCcw,
    Info,
    Star,
    Gift
} from "lucide-react";
import Swal from "sweetalert2";
import ProductService from "../../services/productService";
import ProductVariantService from "../../services/productVariantService";
import { CartContext } from "../../context/CartContext";
import { AIPersonalizedSection } from "../../components/AIComponents";

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [totalStock, setTotalStock] = useState(0);

    const getUser = () => !!localStorage.getItem("access_token");

    const vouchers = [
        {
            code: "FREESHIP20k",
            title: "Voucher freeship 20k",
            subtitle: "Đơn hàng từ 500k",
            expiry: "HSD: 5/12/2025",
            type: "SAO CHÉP MÃ"
        },
        {
            code: "GIAM5%",
            title: "Giảm 5%",
            subtitle: "Đơn hàng từ 1.000.000đ",
            expiry: "HSD: 5/12/2025",
            type: "SAO CHÉP MÃ"
        }
    ];

    const features = [
        { icon: <Shield className="w-5 h-5" />, text: "Cam kết 100% chính hãng" },
        { icon: <Truck className="w-5 h-5" />, text: "Miễn phí giao hàng" },
        { icon: <Clock className="w-5 h-5" />, text: "Hỗ trợ 24/7" },
        {
            icon: <Shield className="w-5 h-5" />,
            text: "Hoàn tiền 111% nếu hàng giả"
        },
        { icon: <Heart className="w-5 h-5" />, text: "Mở hộp kiểm tra nhận hàng" },
        { icon: <RotateCcw className="w-5 h-5" />, text: "Đổi trả trong 7 ngày" }
    ];

    const socialPlatforms = [
        { name: "Facebook", color: "bg-blue-600", icon: "f" },
        { name: "Messenger", color: "bg-blue-500", icon: "m" },
        { name: "Twitter", color: "bg-sky-400", icon: "t" },
        { name: "Pinterest", color: "bg-red-600", icon: "p" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productData = await ProductService.getById(productId);
                if (!productData) throw new Error("Sản phẩm không tồn tại.");
                setProduct(productData);
                setSelectedImage(
                    productData.ThumbnailURL ||
                    "https://via.placeholder.com/500?text=Product"
                );

                const timeout = (ms) =>
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("API request timed out")), ms)
                    );
                const variantData = await Promise.race([
                    ProductVariantService.getAll(),
                    timeout(5000)
                ]);
                const filteredVariants = variantData.filter(
                    (v) => v.ProductID === parseInt(productId)
                );
                setVariants(filteredVariants);

                if (filteredVariants.length > 0) {
                    const defaultVariant = filteredVariants[0];
                    setSelectedVariant(defaultVariant);
                    setSelectedImage(
                        defaultVariant.ImageURL ||
                        productData.ThumbnailURL ||
                        "https://via.placeholder.com/500?text=Product"
                    );
                }

                const stockData = await ProductVariantService.getTotalStock(productId);
                setTotalStock(stockData.TotalStock || 0);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError("Không thể tải thông tin sản phẩm hoặc biến thể.");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchData();
        } else {
            setError("ID sản phẩm không hợp lệ.");
            setLoading(false);
        }
    }, [productId]);

    const handleQuantityChange = (delta) => {
        if (
            selectedVariant &&
            quantity + delta <= selectedVariant.StockQuantity &&
            quantity + delta >= 1
        ) {
            setQuantity(quantity + delta);
        }
    };

    const handleAddToCart = async () => {
        if (!getUser()) {
            Swal.fire({
                icon: "warning",
                title: "Vui lòng đăng nhập!",
                text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }

        if (!selectedVariant) {
            Swal.fire({
                icon: "warning",
                title: "Lỗi",
                text: "Không có biến thể sản phẩm khả dụng!",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }

        if (selectedVariant.StockQuantity === 0) {
            Swal.fire({
                icon: "error",
                title: "Hết hàng",
                text: "Sản phẩm này hiện đã hết hàng!",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }

        try {
            await addToCart(selectedVariant, quantity);
            await Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Đã thêm vào giỏ hàng!",
                timer: 2000,
                showConfirmButton: false
            });
            window.dispatchEvent(
                new CustomEvent("cartItemAdded", {
                    detail: { imageUrl: selectedImage }
                })
            );
            return true;
        } catch (err) {
            console.error("Error adding to cart:", err);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể thêm vào giỏ hàng!",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }
    };

    const handleBuyNow = async () => {
        if (!getUser()) {
            Swal.fire({
                icon: "warning",
                title: "Vui lòng đăng nhập!",
                text: "Bạn cần đăng nhập để tiến hành mua hàng.",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        const success = await handleAddToCart();
        if (success) {
            navigate("/checkout");
        }
    };

    const renderSkeleton = () => (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6">
                    <div className="bg-gray-100 rounded-2xl h-[400px]"></div>
                    <div className="flex gap-3 mt-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-20 h-20 bg-gray-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="h-8 bg-gray-100 rounded"></div>
                    <div className="flex gap-4">
                        <div className="h-4 w-20 bg-gray-100 rounded"></div>
                        <div className="h-4 w-20 bg-gray-100 rounded"></div>
                    </div>
                    <div className="bg-gray-100 p-5 rounded-2xl h-16"></div>
                    <div className="flex gap-4">
                        <div className="h-10 w-32 bg-gray-100 rounded-xl"></div>
                        <div className="h-10 w-32 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center font-japanese bg-gradient-to-br from-white to-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-f72585 text-lg font-semibold border border-pink-200">
                    {error}
                    <button
                        onClick={() => navigate("/products")}
                        className="mt-4 text-white bg-f72585 px-4 py-2 rounded-lg hover:bg-ff477e transition-all duration-300"
                    >
                        Quay lại danh sách sản phẩm
                    </button>
                </div>
            </div>
        );
    }

    if (loading || !product) {
        return (
            <div className="min-h-screen font-japanese antialiased bg-gradient-to-br from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        {renderSkeleton()}
                    </div>
                </div>
            </div>
        );
    }

    const images = variants
        .filter((v) => v.ImageURL)
        .map((v) => v.ImageURL)
        .concat(product.ThumbnailURL || [])
        .filter((url, index, self) => url && self.indexOf(url) === index);

    const displayPrice = selectedVariant?.Price || product?.Price || null;
    const currentProduct = {
        id: product.ProductID,
        name: product.ProductName,
        price: displayPrice,
        image: selectedImage
    };

    return (
        <div className="min-h-screen font-japanese antialiased bg-gradient-to-br from-white to-gray-50">
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap');
          .fade-in { animation: fadeIn 0.5s ease-in; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
          .tooltip { position: relative; }
          .tooltip .tooltip-text {
            visibility: hidden;
            width: 120px;
            background-color: #2d3748;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 10;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s;
          }
          .tooltip:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
          }
          .scrollbar-custom::-webkit-scrollbar {
            height: 6px;
            width: 6px;
          }
          .scrollbar-custom::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
          }
          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .image-container {
            background: white;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            border: 4px solid white;
            transition: transform 0.3s ease;
          }
          .image-container:hover {
            transform: scale(1.02);
          }
          .button-gradient {
            background: #f72585;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(247, 37, 133, 0.3);
            border: none;
            color: white;
            border-radius: 8px;
          }
          .button-gradient:hover {
            background: #ff477e;
            box-shadow: 0 6px 16px rgba(255, 71, 126, 0.5);
            transform: translateY(-2px);
          }
          .button-gradient:disabled {
            background: #d1d5db;
            box-shadow: none;
            cursor: not-allowed;
            opacity: 0.5;
          }
          .price-text {
            font-size: 1.75rem;
            line-height: 2rem;
            font-weight: 700;
            color: #f72585;
            display: inline-block;
            min-height: 2rem;
          }
          .font-japanese {
            font-family: 'Noto Sans JP', sans-serif;
          }
        `}
            </style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left side - Product Images */}
                        <div className="p-8">
                            <div className="space-y-6">
                                {/* Main Image */}
                                <div className="relative group">
                                    <div className="image-container rounded-2xl overflow-hidden">
                                        <img
                                            src={selectedImage}
                                            alt={product.ProductName || "Sản phẩm"}
                                            className="w-full h-[400px] sm:h-[500px] object-contain fade-in"
                                            loading="lazy"
                                            onError={(e) => (e.target.src = "/fallback-image.jpg")}
                                        />
                                        <button
                                            onClick={() => setIsLiked(!isLiked)}
                                            className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-pink-100 transition-all duration-300 hover:scale-105 tooltip"
                                            aria-label={
                                                isLiked ? "Bỏ thích sản phẩm" : "Thích sản phẩm"
                                            }
                                        >
                                            <Heart
                                                className={`w-5 h-5 transition-all duration-300 ${isLiked ? "text-f72585 fill-f72585" : "text-gray-500"
                                                    }`}
                                            />
                                            <span className="tooltip-text">
                                                {isLiked ? "Bỏ thích" : "Thích"}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {/* Thumbnail Images */}
                                <div className="flex gap-3 overflow-x-auto scrollbar-custom">
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${product.ProductName || "Sản phẩm"} ${index + 1}`}
                                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 border-2 transition-all duration-300 ${selectedImage === img
                                                ? "border-f72585 shadow-md"
                                                : "border-gray-200 hover:border-f72585 hover:shadow-sm"
                                                }`}
                                            onClick={() => setSelectedImage(img)}
                                            onError={(e) => (e.target.src = "/fallback-image.jpg")}
                                        />
                                    ))}
                                </div>
                                {/* Social Share */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-600">
                                        Chia sẻ:
                                    </span>
                                    <div className="flex gap-2">
                                        {socialPlatforms.map((platform, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-8 h-8 ${platform.color} rounded-full flex items-center justify-center text-white text-sm transition-all duration-300 hover:scale-105 tooltip`}
                                                aria-label={`Chia sẻ trên ${platform.name}`}
                                            >
                                                {platform.icon.toUpperCase()}
                                                <span className="tooltip-text">
                                                    Chia sẻ trên {platform.name}
                                                </span>
                                            </button>
                                        ))}
                                        <button
                                            className="w-8 h-8 button-gradient rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-105 tooltip"
                                            aria-label="Chia sẻ qua các nền tảng khác"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            <span className="tooltip-text">Chia sẻ khác</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Right side - Product Info */}
                        <div className="p-8 space-y-6">
                            {/* Product Title & Rating */}
                            <div className="space-y-3">
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                    {product.ProductName || "Sản phẩm không xác định"}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.rating || 4.5)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-200"
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-sm font-medium text-gray-600 ml-2">
                                            {(product.rating || 4.5).toFixed(1)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        ({product.reviewCount || 120} đánh giá)
                                    </span>
                                </div>
                            </div>
                            {/* Brand and Status */}
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">
                                    Tình trạng:{" "}
                                    <span className="text-f72585 font-medium">
                                        {totalStock > 0 ? "Còn hàng" : "Hết hàng"}
                                    </span>
                                </span>
                                <span className="text-gray-600">
                                    Thương hiệu:{" "}
                                    {product.seller?.UserID ? (
                                        <button
                                            onClick={() => navigate(`/brands/id/${product.seller.UserID}`)}
                                            className="text-f72585 font-medium underline hover:text-ff477e transition"
                                        >
                                            {product.seller.FullName}
                                        </button>
                                    ) : (
                                        <span className="text-f72585 font-medium">Không xác định</span>
                                    )}
                                </span>
                            </div>
                            {/* Price */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    {displayPrice ? (
                                        <span className="price-text">
                                            {displayPrice.toLocaleString("vi-VN")} ₫
                                        </span>
                                    ) : (
                                        <span className="price-text text-f72585">
                                            Giá không khả dụng
                                        </span>
                                    )}
                                    {product.originalPrice && displayPrice && (
                                        <span className="text-base text-gray-400 line-through">
                                            {product.originalPrice.toLocaleString("vi-VN")}₫
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Quantity */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-gray-800">
                                    Số lượng:
                                </span>
                                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="px-3 py-2 hover:bg-pink-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={quantity <= 1 || !selectedVariant}
                                        aria-label="Giảm số lượng"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 py-2 font-medium text-gray-800">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="px-3 py-2 hover:bg-pink-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={
                                            !selectedVariant ||
                                            quantity >= (selectedVariant?.StockQuantity || 0)
                                        }
                                        aria-label="Tăng số lượng"
                                    >
                                        +
                                    </button>
                                </div>
                                {selectedVariant && (
                                    <span className="text-sm text-gray-500">
                                        {selectedVariant.StockQuantity} sản phẩm sẵn có
                                    </span>
                                )}
                            </div>
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 text-white border-2 border-transparent py-2.5 px-6 rounded-lg font-medium button-gradient disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!selectedVariant}
                                    aria-label="Thêm sản phẩm vào giỏ hàng"
                                >
                                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                                    Thêm vào giỏ
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 text-white border-2 border-transparent py-2.5 px-6 rounded-lg font-medium button-gradient disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!selectedVariant}
                                    aria-label="Mua ngay sản phẩm"
                                >
                                    Mua ngay
                                </button>
                            </div>
                            {/* Features */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-gray-600"
                                    >
                                        <div className="text-f72585">{feature.icon}</div>
                                        <span className="font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Vouchers */}
                            <div className="space-y-3">
                                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-f72585" />
                                    Khuyến mãi
                                </h3>
                                <div className="space-y-2">
                                    {vouchers.map((voucher, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50"
                                        >
                                            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                <span className="text-f72585 font-bold text-sm">
                                                    {voucher.code.includes("FREESHIP") ? "FS" : "5%"}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-800">
                                                    {voucher.title}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {voucher.subtitle} | {voucher.expiry}
                                                </div>
                                            </div>
                                            <button
                                                className="text-xs text-white px-3 py-1 rounded-lg button-gradient"
                                                aria-label={`Sao chép mã ${voucher.code}`}
                                            >
                                                {voucher.type}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Product Description */}
                    <div className="border-t border-gray-100 p-8">
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-f72585" />
                                Mô tả sản phẩm
                            </h2>
                            <div className="text-gray-600 text-sm space-y-3">
                                <div className="whitespace-pre-line">
                                    {product.Description || "Không có mô tả"}
                                </div>
                                {product.ingredients && (
                                    <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
                                        <div className="font-medium text-f72585 mb-1">
                                            {product.ingredients}
                                        </div>
                                        <div className="text-f72585 text-xs">
                                            Sản phẩm có chứa thành phần trong trứng một phần nguyên
                                            liệu.
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                className="mt-4 text-white border-2 border-transparent px-4 py-1.5 rounded-lg text-sm font-medium button-gradient"
                                aria-label="Xem thêm mô tả sản phẩm"
                            >
                                + Xem thêm
                            </button>
                        </div>
                    </div>
                    {/* AIPersonalizedSection Component */}
                    <div className="border-t border-gray-100 p-8">
                        <AIPersonalizedSection
                            productId={productId}
                            currentProduct={currentProduct}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
