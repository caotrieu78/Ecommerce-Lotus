import React, { useEffect, useState, useMemo } from "react";
import {
    FaPlus,
    FaMinus,
    FaTrash,
    FaShoppingCart,
    FaCheckCircle,
    FaGift
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CartService from "../services/CartService";
import { PATHS } from "../constants/paths";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [orderNote, setOrderNote] = useState(""); // State để quản lý ghi chú

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

    // Calculate subtotal and total
    const subtotal = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => sum + item.Quantity * (item.variant?.Price || 0),
            0
        );
    }, [cartItems]);

    const total = useMemo(() => {
        return subtotal;
    }, [subtotal]);

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            try {
                const data = await CartService.getAll();
                setCartItems(data ?? []);
                setError(null);
                setRetryCount(0);
            } catch (error) {
                console.error("Lỗi tải giỏ hàng:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate(PATHS.LOGIN);
                    setToast({
                        show: true,
                        message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
                        type: "error"
                    });
                    setTimeout(
                        () => setToast({ show: false, message: "", type: "" }),
                        3000
                    );
                } else if (retryCount < 3) {
                    setTimeout(() => setRetryCount(retryCount + 1), 2000);
                } else {
                    setError("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCart();
    }, [retryCount, navigate]);

    const handleQuantity = async (variantId, newQty) => {
        if (newQty < 1) return;
        try {
            await CartService.updateItem(variantId, newQty);
            setCartItems((prev) =>
                prev.map((item) =>
                    item.variant.VariantID === variantId
                        ? { ...item, Quantity: newQty }
                        : item
                )
            );
            setToast({
                show: true,
                message: "Cập nhật số lượng thành công!",
                type: "success"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        } catch (error) {
            console.error("Lỗi cập nhật số lượng:", error);
            setError("Không thể cập nhật số lượng. Vui lòng thử lại.");
            setToast({
                show: true,
                message: "Không thể cập nhật số lượng.",
                type: "error"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        }
    };

    const handleRemoveItem = async (variantId) => {
        if (
            !window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?")
        )
            return;
        try {
            await CartService.removeItem(variantId);
            setCartItems((prev) =>
                prev.filter((item) => item.variant.VariantID !== variantId)
            );
            setToast({
                show: true,
                message: "Xóa sản phẩm khỏi giỏ hàng thành công!",
                type: "success"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
            setError("Không thể xóa sản phẩm. Vui lòng thử lại.");
            setToast({
                show: true,
                message: "Không thể xóa sản phẩm.",
                type: "error"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        }
    };

    const handleCopyVoucher = (code) => {
        navigator.clipboard.writeText(code);
        setToast({
            show: true,
            message: `Đã sao chép mã ${code}!`,
            type: "success"
        });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-['Noto_Sans_JP']">
            <style>
                {`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in { animation: slideIn 0.5s ease-out; }
          .animate-fade-in { animation: fadeIn 0.6s ease-out; }
          .hover-scale { transition: transform 0.3s ease; }
          .hover-scale:hover { transform: scale(1.05); }
          .progress-bar {
            height: 4px;
            background-color: #f3f4f6;
            border-radius: 9999px;
            overflow: hidden;
          }
          .progress-bar-fill {
            height: 100%;
            background-color: #ec4899;
            width: 33.33%;
            transition: width 0.3s ease;
            border-radius: 9999px;
          }
          .gradient-btn {
            background: linear-gradient(45deg, #ec4899, #f472b6);
            transition: all 0.3s ease;
          }
          .gradient-btn:hover {
            background: linear-gradient(45deg, #db2777, #e879f9);
            transform: scale(1.05);
          }
          .note-box {
            background-color: #fff5f7; /* Nền hồng nhạt */
            border: 1px solid #f472b6; /* Viền hồng nhạt */
            border-radius: 4px;
            padding: 0.25rem 0.5rem;
            margin-top: 0.25rem;
            color: #f472b6; /* Chữ hồng nhạt */
            font-size: 0.75rem; /* Kích thước nhỏ */
          }
          .note-input {
            border: 1px solid #f472b6;
            border-radius: 4px;
            padding: 0.5rem;
            width: 100%;
            resize: none;
            font-size: 0.875rem;
            color: #374151;
            background-color: #fff;
            transition: border-color 0.3s ease;
          }
          .note-input:focus {
            outline: none;
            border-color: #ec4899;
            box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.2);
          }
        `}
            </style>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
                <h2
                    className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3 mb-8 animate-slide-in"
                    role="heading"
                    aria-level="2"
                >
                    <FaShoppingCart className="text-pink-600" /> Giỏ hàng của bạn
                </h2>

                {/* Progress Bar */}
                <div className="flex justify-between mb-10 relative animate-slide-in">
                    <div className="absolute top-5 left-10 right-10 progress-bar">
                        <div className="progress-bar-fill"></div>
                    </div>
                    {["Giỏ hàng", "Thanh toán", "Hoàn tất"].map((step, index) => (
                        <div key={index} className="flex flex-col items-center z-10">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg shadow-md transition-colors ${index === 0
                                    ? "bg-pink-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <span className="mt-2 text-sm font-medium text-gray-600">
                                {step}
                            </span>
                        </div>
                    ))}
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse"
                            >
                                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                                <div className="ml-4 flex-1 space-y-2">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-100 text-red-600 p-4 rounded-lg flex justify-between items-center mb-6 animate-fade-in">
                        <span>{error}</span>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors hover-scale"
                            onClick={() => setRetryCount(retryCount + 1)}
                            aria-label="Thử lại"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-12 animate-fade-in">
                        <p className="text-gray-500 text-lg mb-4">
                            Giỏ hàng của bạn đang trống!
                        </p>
                        <button
                            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors hover-scale"
                            onClick={() => navigate(PATHS.HOME)}
                            aria-label="Tiếp tục mua sắm"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.variant.VariantID}
                                    className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-in"
                                    role="listitem"
                                >
                                    <img
                                        src={
                                            item.variant?.ImageURL ||
                                            item.variant?.product?.ThumbnailURL ||
                                            "https://placehold.co/80x80?text=No+Image"
                                        }
                                        alt={item.variant?.product?.ProductName || "Sản phẩm"}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                        loading="lazy"
                                        onError={(e) =>
                                        (e.target.src =
                                            "https://placehold.co/80x80?text=No+Image")
                                        }
                                    />
                                    <div className="ml-4 flex-1">
                                        <h5 className="text-base font-semibold text-gray-800">
                                            {item.variant?.product?.ProductName ||
                                                "Sản phẩm không xác định"}
                                        </h5>
                                        <p className="text-sm text-gray-500">
                                            Kích thước: {item.variant?.size?.SizeName || "-"} | Màu
                                            sắc: {item.variant?.color?.ColorName || "-"}
                                        </p>
                                        <div className="flex items-center mt-2 gap-4">
                                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                                <button
                                                    className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() =>
                                                        handleQuantity(
                                                            item.variant.VariantID,
                                                            item.Quantity - 1
                                                        )
                                                    }
                                                    disabled={item.Quantity <= 1}
                                                    aria-label="Giảm số lượng"
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className="px-4 py-2 font-medium text-gray-800">
                                                    {item.Quantity}
                                                </span>
                                                <button
                                                    className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() =>
                                                        handleQuantity(
                                                            item.variant.VariantID,
                                                            item.Quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.Quantity >= (item.variant?.StockQuantity || 10)
                                                    }
                                                    aria-label="Tăng số lượng"
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                            <span className="text-pink-600 font-semibold">
                                                {(
                                                    item.Quantity * (item.variant?.Price || 0)
                                                ).toLocaleString("vi-VN")}{" "}
                                                ₫
                                            </span>
                                        </div>
                                        <div className="note-box">
                                            * Sản phẩm được giao trong 2-3 ngày làm việc
                                        </div>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        onClick={() => handleRemoveItem(item.variant.VariantID)}
                                        aria-label="Xóa sản phẩm"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <div className="space-y-2 mt-4">
                                <label
                                    htmlFor="order-note"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Ghi chú đơn hàng
                                </label>
                                <textarea
                                    id="order-note"
                                    className="note-input"
                                    rows="3"
                                    maxLength="200"
                                    placeholder="*Nhập ghi chú cho đơn hàng (ví dụ: giao hàng sau 18h)"
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    aria-label="Nhập ghi chú cho đơn hàng"
                                />
                                <p className="text-xs text-gray-500 text-right">
                                    {orderNote.length}/200
                                </p>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Tổng quan đơn hàng
                                </h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-gray-700">
                                            <span>Tạm tính:</span>
                                            <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
                                        </div>
                                        <div className="flex justify-between text-base font-semibold text-gray-900">
                                            <span>Tổng cộng:</span>
                                            <span>{total.toLocaleString("vi-VN")} ₫</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                            <FaGift className="text-pink-600" />
                                            Khuyến mãi
                                        </h3>
                                        <div className="space-y-2">
                                            {vouchers.map((voucher, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50"
                                                >
                                                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-pink-600 font-bold text-sm">
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
                                                        className="text-xs text-white px-3 py-1 rounded-lg gradient-btn"
                                                        onClick={() => handleCopyVoucher(voucher.code)}
                                                        aria-label={`Sao chép mã ${voucher.code}`}
                                                    >
                                                        {voucher.type}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 hover-scale"
                                        onClick={() =>
                                            navigate(PATHS.CHECKOUT, {
                                                state: { cartItems, orderNote }
                                            })
                                        }
                                        disabled={cartItems.length === 0}
                                        aria-label="Tiến hành thanh toán"
                                    >
                                        Tiến hành thanh toán
                                    </button>
                                    <button
                                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors mt-2 hover-scale"
                                        onClick={() => navigate(PATHS.HOME)}
                                        aria-label="Tiếp tục mua sắm"
                                    >
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {toast.show && (
                    <div
                        className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white animate-slide-in ${toast.type === "success" ? "bg-pink-600" : "bg-red-600"
                            }`}
                        role="alert"
                        aria-live="assertive"
                    >
                        <FaCheckCircle /> {toast.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
