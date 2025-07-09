import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../constants/paths";
import CartService from "../services/CartService";
import OrderService from "../services/orderService";
import { FaCheckCircle } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import QRCode from "react-qr-code"; // Thêm thư viện react-qr-code

const Checkout = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { clearCart } = useContext(CartContext);
    const {
        cartItems: initialCartItems = [],
        voucherCode = "",
        discount = 0
    } = state || {};
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        phone: "",
        paymentMethod: "cod",
        promoCode: voucherCode
    });
    const [formErrors, setFormErrors] = useState({});

    const subtotal = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => sum + (item.Quantity || 0) * (item.variant?.Price || 0),
            0
        );
    }, [cartItems]);

    const deliveryFee = 0;
    const [promoDiscount, setPromoDiscount] = useState(discount * subtotal);
    const total = subtotal - promoDiscount;

    useEffect(() => {
        setPromoDiscount(discount * subtotal);
    }, [discount, subtotal]);

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            try {
                const data = await CartService.getAll();
                if (!Array.isArray(data)) {
                    throw new Error("Dữ liệu giỏ hàng không hợp lệ");
                }
                setCartItems(data);
                setError(null);
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
                } else {
                    setError(
                        error.message || "Không thể tải giỏ hàng. Vui lòng thử lại sau."
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errors = { ...formErrors };
        switch (name) {
            case "fullName":
                errors.fullName =
                    value.length < 2 ? "Họ tên phải có ít nhất 2 ký tự" : "";
                break;
            case "address":
                errors.address =
                    value.length < 5 ? "Địa chỉ phải có ít nhất 5 ký tự" : "";
                break;
            case "phone":
                errors.phone = !/^\d{10,11}$/.test(value)
                    ? "Số điện thoại phải có 10-11 chữ số"
                    : "";
                break;
            default:
                break;
        }
        setFormErrors(errors);
    };

    const validateForm = () => {
        const errors = {};
        if (formData.fullName.length < 2)
            errors.fullName = "Họ tên phải có ít nhất 2 ký tự";
        if (formData.address.length < 5)
            errors.address = "Địa chỉ phải có ít nhất 5 ký tự";
        if (!/^\d{10,11}$/.test(formData.phone))
            errors.phone = "Số điện thoại phải có 10-11 chữ số";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleApplyPromo = () => {
        const validVouchers = ["DISCOUNT10", "SAVE20"];
        if (validVouchers.includes(formData.promoCode)) {
            setPromoDiscount(
                formData.promoCode === "DISCOUNT10" ? subtotal * 0.1 : subtotal * 0.2
            );
            setToast({
                show: true,
                message: "Áp dụng mã giảm giá thành công!",
                type: "success"
            });
        } else {
            setPromoDiscount(0);
            setToast({
                show: true,
                message: "Mã giảm giá không hợp lệ!",
                type: "error"
            });
        }
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setToast({
                show: true,
                message: "Vui lòng điền đầy đủ thông tin bắt buộc!",
                type: "error"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                cartItems,
                ...formData,
                total,
                promoDiscount
            };
            const response = await OrderService.create(orderData);
            await clearCart();
            setCartItems([]);
            setToast({
                show: true,
                message: "Đặt hàng thành công!",
                type: "success"
            });
            setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                navigate(PATHS.ORDER_CONFIRMATION, {
                    state: { total, formData, cartItems, orderId: response.orderId }
                });
            }, 3000);
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                navigate(PATHS.LOGIN);
                setToast({
                    show: true,
                    message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
                    type: "error"
                });
            } else {
                setToast({
                    show: true,
                    message:
                        error.response?.data?.message ||
                        "Đặt hàng thất bại. Vui lòng thử lại.",
                    type: "error"
                });
            }
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const SkeletonLoader = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="h-10 bg-gray-200 rounded-lg animate-pulse"
                    ></div>
                ))}
            </div>
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-['Noto_Sans_JP'] antialiased">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
                <h2
                    className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-6"
                    role="heading"
                    aria-level="2"
                >
                    Thanh toán
                </h2>

                <div className="flex justify-between mb-8 relative">
                    <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 rounded z-0">
                        <div className="h-full bg-pink-600 w-2/3 rounded transition-all duration-300"></div>
                    </div>
                    {["Giỏ hàng", "Thanh toán", "Hoàn tất"].map((step, index) => (
                        <div key={index} className="flex flex-col items-center z-10">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg shadow-md transition-all duration-300 ${index <= 1
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
                    <SkeletonLoader />
                ) : error ? (
                    <div
                        className="bg-red-100 text-red-600 p-4 rounded-lg flex justify-between items-center mb-4"
                        role="alert"
                    >
                        <span>{error}</span>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            onClick={() => setError(null)}
                            aria-label="Thử lại"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg mb-4">
                            Giỏ hàng của bạn đang trống!
                        </p>
                        <button
                            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                            onClick={() => navigate(PATHS.HOME)}
                            aria-label="Tiếp tục mua sắm"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Thông tin giao hàng
                            </h4>
                            <form onSubmit={handleSubmitOrder}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full border ${formErrors.fullName ? "border-red-500" : "border-gray-200"
                                            } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600`}
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        aria-describedby={
                                            formErrors.fullName ? "fullName-error" : undefined
                                        }
                                    />
                                    {formErrors.fullName && (
                                        <p
                                            id="fullName-error"
                                            className="text-red-500 text-sm mt-1"
                                        >
                                            {formErrors.fullName}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        className={`w-full border ${formErrors.address ? "border-red-500" : "border-gray-200"
                                            } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600`}
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        aria-describedby={
                                            formErrors.address ? "address-error" : undefined
                                        }
                                    />
                                    {formErrors.address && (
                                        <p id="address-error" className="text-red-500 text-sm mt-1">
                                            {formErrors.address}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        className={`w-full border ${formErrors.phone ? "border-red-500" : "border-gray-200"
                                            } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600`}
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        aria-describedby={
                                            formErrors.phone ? "phone-error" : undefined
                                        }
                                    />
                                    {formErrors.phone && (
                                        <p id="phone-error" className="text-red-500 text-sm mt-1">
                                            {formErrors.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phương thức thanh toán
                                    </label>
                                    <select
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                    >
                                        <option value="cod">Thanh toán khi nhận hàng</option>
                                        <option value="card">Thẻ ngân hàng</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="promoCode"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Mã giảm giá
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                                            id="promoCode"
                                            name="promoCode"
                                            value={formData.promoCode}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                                            onClick={handleApplyPromo}
                                            aria-label="Áp dụng mã giảm giá"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting || cartItems.length === 0}
                                    aria-label="Đặt hàng"
                                    aria-busy={isSubmitting}
                                >
                                    {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
                                </button>
                            </form>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-4">
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                    Tổng quan đơn hàng
                                </h4>
                                {cartItems.map((item) => (
                                    <div
                                        key={item.variant?.VariantID || Math.random()}
                                        className="flex justify-between mb-2 text-sm"
                                    >
                                        <span>
                                            {item.variant?.product?.ProductName || "Sản phẩm"} x{" "}
                                            {item.Quantity}
                                        </span>
                                        <span>
                                            {(
                                                item.Quantity * (item.variant?.Price || 0)
                                            ).toLocaleString("vi-VN")}{" "}
                                            ₫
                                        </span>
                                    </div>
                                ))}
                                <hr className="my-2" />
                                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>Tạm tính:</span>
                                    <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>Phí giao hàng:</span>
                                    <span>Miễn phí</span>
                                </div>
                                {promoDiscount > 0 && (
                                    <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                        <span>Giảm giá ({formData.promoCode}):</span>
                                        <span>-{promoDiscount.toLocaleString("vi-VN")} ₫</span>
                                    </div>
                                )}
                                <hr className="my-2" />
                                <div className="flex justify-between text-base font-semibold text-gray-900">
                                    <span>Tổng cộng:</span>
                                    <span>{total.toLocaleString("vi-VN")} ₫</span>
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
                        aria-atomic="true"
                    >
                        <FaCheckCircle /> {toast.message}
                    </div>
                )}
            </div>
        </div>
    );
};

const OrderConfirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const { total, formData, cartItems, orderId } = state || {};
    const currentDateTime = new Date().toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        dateStyle: "medium",
        timeStyle: "short"
    });

    // Tạo dữ liệu cho mã QR
    const qrCodeValue = useMemo(() => {
        if (orderId && total && formData) {
            return JSON.stringify({
                orderId: orderId || "N/A",
                amount: total,
                currency: "VND",
                customerName: formData.fullName,
                timestamp: currentDateTime
            });
        }
        return "";
    }, [orderId, total, formData, currentDateTime]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!total || !formData || !cartItems) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-['Noto_Sans_JP'] antialiased">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg mb-4">
                            Không có thông tin đơn hàng.
                        </p>
                        <button
                            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                            onClick={() => navigate(PATHS.HOME)}
                            aria-label="Về trang chủ"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-['Noto_Sans_JP'] antialiased">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
                    <div className="text-center py-10">
                        <p className="text-gray-500 text-lg">
                            Đang tải, vui lòng đợi trong giây lát...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 font-['Noto_Sans_JP'] antialiased">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                        <FaCheckCircle className="text-pink-600 text-4xl mb-4 mx-auto" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Cảm ơn bạn đã đặt hàng!
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Đơn hàng của bạn đã được đặt thành công vào {currentDateTime}
                        </p>
                        <p className="text-gray-600">Mã đơn hàng: {orderId || "N/A"}</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Chi tiết đơn hàng
                        </h4>
                        <ul className="divide-y divide-gray-100">
                            <li className="flex justify-between py-2">
                                <span className="font-medium">Họ và tên:</span>
                                <span>{formData.fullName}</span>
                            </li>
                            <li className="flex justify-between py-2">
                                <span className="font-medium">Địa chỉ:</span>
                                <span>{formData.address}</span>
                            </li>
                            <li className="flex justify-between py-2">
                                <span className="font-medium">Số điện thoại:</span>
                                <span>{formData.phone}</span>
                            </li>
                            <li className="flex justify-between py-2">
                                <span className="font-medium">Phương thức thanh toán:</span>
                                <span>
                                    {formData.paymentMethod === "cod"
                                        ? "Thanh toán khi nhận hàng"
                                        : "Thẻ ngân hàng"}
                                </span>
                            </li>
                            <li className="flex justify-between py-2">
                                <span className="font-medium">Tổng cộng:</span>
                                <span>{total.toLocaleString("vi-VN")} ₫</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Mã QR đơn hàng
                        </h4>
                        <div className="flex justify-center">
                            <div style={{ background: "white", padding: "16px" }}>
                                <QRCode
                                    value={qrCodeValue}
                                    size={200}
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                />
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 text-center">
                            Quét mã QR để xem chi tiết đơn hàng hoặc xác nhận thanh toán.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Sản phẩm đã mua
                        </h4>
                        <ul className="divide-y divide-gray-100">
                            {cartItems.map((item) => (
                                <li
                                    key={item.variant?.VariantID || Math.random()}
                                    className="flex justify-between py-2"
                                >
                                    <span>
                                        {item.variant?.product?.ProductName || "Sản phẩm"} x{" "}
                                        {item.Quantity}
                                    </span>
                                    <span>
                                        {(
                                            item.Quantity * (item.variant?.Price || 0)
                                        ).toLocaleString("vi-VN")}{" "}
                                        ₫
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-center">
                        <button
                            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors"
                            onClick={() => navigate(PATHS.HOME)}
                            aria-label="Về trang chủ"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Checkout, OrderConfirmation };
