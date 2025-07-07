import React, { useEffect, useState, useContext } from "react";
import { FaTimes, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import ConfirmModal from "./ConfirmModal";
import Swal from "sweetalert2";

const CartPanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const {
        cartItems,
        fetchCart,
        updateCartItem,
        removeFromCart,
        isLoading,
        error
    } = useContext(CartContext);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmVariantId, setConfirmVariantId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    const handleQuantity = async (variantId, newQty) => {
        if (newQty < 1) return;
        try {
            await updateCartItem(variantId, newQty);
        } catch {
            Swal.fire("Error", "Unable to update cart quantity!", "error");
        }
    };

    const confirmRemoveItem = (variantId) => {
        setConfirmVariantId(variantId);
        setShowConfirm(true);
    };

    const handleRemoveItem = async () => {
        try {
            await removeFromCart(confirmVariantId);
        } catch {
            Swal.fire("Error", "Unable to remove item from cart!", "error");
        } finally {
            setShowConfirm(false);
            setConfirmVariantId(null);
        }
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.Quantity * (item.variant?.Price || 0),
        0
    );

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end" onClick={onClose}>
                <div
                    className="bg-white w-full md:w-[400px] h-full p-4 flex flex-col overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center border-b pb-3 mb-3">
                        <h2 className="text-xl font-bold text-pink-700">Giỏ hàng ({cartItems.length})</h2>
                        <button onClick={onClose}>
                            <FaTimes className="text-gray-700 text-xl" />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center flex-1">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-500" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-center">
                            <p className="text-gray-500 text-lg mb-4">Giỏ hàng của bạn đang trống.</p>
                            <button
                                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
                                onClick={() => {
                                    onClose();
                                    navigate("/products");
                                }}
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    ) : (
                        <div className="flex-1 space-y-4 overflow-auto">
                            {cartItems.map((item) => (
                                <div key={item.variant.VariantID} className="flex gap-4 p-3 rounded-md border shadow-sm">
                                    <img
                                        src={item.variant.ImageURL || "/placeholder.png"}
                                        alt="product"
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex flex-col justify-between flex-1">
                                        <div>
                                            <h3 className="text-sm font-semibold">{item.variant.product?.ProductName}</h3>
                                            <p className="text-xs text-gray-500">
                                                Size: {item.variant.size?.SizeName || "-"} | Color: {item.variant.color?.ColorName || "-"}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQuantity(item.variant.VariantID, item.Quantity - 1)}
                                                    className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                                                    disabled={item.Quantity <= 1}
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className="px-3 text-sm">{item.Quantity}</span>
                                                <button
                                                    onClick={() => handleQuantity(item.variant.VariantID, item.Quantity + 1)}
                                                    className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-pink-600 font-semibold text-sm">
                                                    {(item.Quantity * item.variant.Price).toLocaleString()} ₫
                                                </span>
                                                <button onClick={() => confirmRemoveItem(item.variant.VariantID)}>
                                                    <FaTrash className="text-red-500 hover:text-red-700" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="pt-4 border-t mt-4">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span>Tổng cộng:</span>
                                <span className="text-pink-600">{total.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="w-1/2 border border-gray-300 rounded-md py-2 hover:bg-gray-100"
                                    onClick={() => {
                                        onClose();
                                        navigate("/cart");
                                    }}
                                >
                                    Xem giỏ
                                </button>
                                <button
                                    className="w-1/2 bg-pink-600 text-white rounded-md py-2 hover:bg-pink-700"
                                    onClick={() => {
                                        onClose();
                                        navigate("/checkout");
                                    }}
                                >
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    )}
                    <ConfirmModal
                        show={showConfirm}
                        title="Xác nhận xoá"
                        message="Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng không?"
                        onConfirm={handleRemoveItem}
                        onClose={() => setShowConfirm(false)}
                    />
                </div>
            </div>
        </>
    );
};

export default CartPanel;
