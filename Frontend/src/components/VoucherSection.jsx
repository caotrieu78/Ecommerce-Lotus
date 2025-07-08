import React from "react";

const vouchers = [
    {
        id: 1,
        discount: "₫10k",
        minOrder: "₫199k",
        label: "Sản phẩm nhất định",
        expiresIn: "Còn 10 giờ",
    },
    {
        id: 2,
        discount: "₫20k",
        minOrder: "₫299k",
        label: "Sản phẩm nhất định",
        expiresIn: "Còn 10 giờ",
    },
    {
        id: 3,
        discount: "₫35k",
        minOrder: "₫399k",
        label: "Sản phẩm nhất định",
        expiresIn: "Còn 10 giờ",
    },
];

const VoucherSection = () => {
    return (
        <div className="w-full bg-white py-6">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Mã Giảm Giá</h2>
                <div className="flex flex-wrap gap-4">
                    {vouchers.map((voucher) => (
                        <div
                            key={voucher.id}
                            className="flex w-full sm:w-[300px] bg-red-50 border border-red-200 rounded shadow-sm"
                        >
                            {/* Left content */}
                            <div className="flex-1 p-4">
                                <p className="text-red-600 font-bold text-base">
                                    Giảm {voucher.discount}
                                </p>
                                <p className="text-sm text-red-600 mb-1">
                                    Đơn Tối Thiểu {voucher.minOrder}
                                </p>
                                <p className="inline-block text-xs border border-red-600 text-red-600 px-2 py-0.5 rounded">
                                    {voucher.label}
                                </p>
                                <p className="text-xs text-red-500 mt-1">
                                    Sắp hết hạn: {voucher.expiresIn}
                                </p>
                            </div>

                            {/* Right button */}
                            <div className="border-l border-dashed border-red-300 flex items-center justify-center px-4">
                                <button className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded">
                                    LƯU
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VoucherSection;
