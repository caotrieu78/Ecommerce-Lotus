import React, { useState } from 'react';
import { Package, Eye, RotateCcw, Truck, CheckCircle, Clock, AlertCircle, Search, Filter, Calendar } from 'lucide-react';

const MyOrders = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orders = [
        {
            id: "#DH001",
            date: "09/07/2025",
            status: "processing",
            statusText: "Đang xử lý",
            total: 1200000,
            items: 3,
            products: [
                { name: "Bánh trứng Manna Bolo 36g", quantity: 2, price: 68000, image: "/api/placeholder/80/80" },
                { name: "Sữa tắm Dove 250ml", quantity: 1, price: 450000, image: "/api/placeholder/80/80" },
                { name: "Tã em bé Pampers L", quantity: 1, price: 320000, image: "/api/placeholder/80/80" }
            ],
            deliveryAddress: "123 Đường ABC, Quận XYZ, TP.HCM",
            paymentMethod: "COD",
            estimatedDelivery: "12/07/2025"
        },
        {
            id: "#DH002",
            date: "01/07/2025",
            status: "delivered",
            statusText: "Đã giao",
            total: 850000,
            items: 2,
            products: [
                { name: "Máy lọc không khí Xiaomi", quantity: 1, price: 2890000, image: "/api/placeholder/80/80" },
                { name: "Bánh trứng Manna Bolo 36g", quantity: 5, price: 68000, image: "/api/placeholder/80/80" }
            ],
            deliveryAddress: "123 Đường ABC, Quận XYZ, TP.HCM",
            paymentMethod: "Thẻ tín dụng",
            deliveredDate: "05/07/2025"
        },
        {
            id: "#DH003",
            date: "25/06/2025",
            status: "shipping",
            statusText: "Đang giao",
            total: 675000,
            items: 1,
            products: [
                { name: "Sữa tắm Dove 250ml", quantity: 3, price: 450000, image: "/api/placeholder/80/80" }
            ],
            deliveryAddress: "456 Đường DEF, Quận ABC, TP.HCM",
            paymentMethod: "Ví điện tử",
            estimatedDelivery: "10/07/2025"
        },
        {
            id: "#DH004",
            date: "20/06/2025",
            status: "cancelled",
            statusText: "Đã hủy",
            total: 320000,
            items: 1,
            products: [
                { name: "Tã em bé Pampers L", quantity: 1, price: 320000, image: "/api/placeholder/80/80" }
            ],
            deliveryAddress: "789 Đường GHI, Quận DEF, TP.HCM",
            paymentMethod: "COD",
            cancelReason: "Khách hàng hủy đơn"
        }
    ];

    const statusFilters = [
        { value: 'all', label: 'Tất cả', count: orders.length },
        { value: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
        { value: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
        { value: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
        { value: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'processing': return <Clock className="w-4 h-4" />;
            case 'shipping': return <Truck className="w-4 h-4" />;
            case 'delivered': return <CheckCircle className="w-4 h-4" />;
            case 'cancelled': return <AlertCircle className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'shipping': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.products.some(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    const OrderDetailModal = ({ order, onClose }) => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng {order.id}</h3>
                        <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                            ×
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Order Status */}
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-2 rounded-full border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="font-medium">{order.statusText}</span>
                        </div>
                        <span className="text-gray-600">• {order.date}</span>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Sản phẩm đã đặt</h4>
                        <div className="space-y-3">
                            {order.products.map((product, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <h5 className="font-medium text-gray-900">{product.name}</h5>
                                        <div className="text-sm text-gray-600">Số lượng: {product.quantity}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">{(product.price * product.quantity).toLocaleString()}₫</div>
                                        <div className="text-sm text-gray-600">{product.price.toLocaleString()}₫/sp</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Thông tin giao hàng</h4>
                            <div className="text-sm text-gray-600">
                                <div className="mb-2">
                                    <span className="font-medium">Địa chỉ:</span>
                                    <div>{order.deliveryAddress}</div>
                                </div>
                                {order.estimatedDelivery && (
                                    <div>
                                        <span className="font-medium">Dự kiến giao:</span> {order.estimatedDelivery}
                                    </div>
                                )}
                                {order.deliveredDate && (
                                    <div>
                                        <span className="font-medium">Đã giao:</span> {order.deliveredDate}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Thanh toán</h4>
                            <div className="text-sm text-gray-600">
                                <div className="mb-2">
                                    <span className="font-medium">Phương thức:</span> {order.paymentMethod}
                                </div>
                                <div className="text-lg font-bold text-pink-600">
                                    Tổng cộng: {order.total.toLocaleString()}₫
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Reason */}
                    {order.cancelReason && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                            <span className="font-medium text-red-800">Lý do hủy:</span>
                            <div className="text-red-700">{order.cancelReason}</div>
                        </div>
                    )}
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
                        <Package className="w-8 h-8 text-pink-500" />
                        Đơn hàng của tôi
                    </h1>
                    <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {statusFilters.slice(1).map(filter => (
                        <div key={filter.value} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${getStatusColor(filter.value)}`}>
                                {getStatusIcon(filter.value)}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{filter.count}</div>
                            <div className="text-sm text-gray-600">{filter.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 overflow-x-auto">
                            {statusFilters.map(filter => (
                                <button
                                    key={filter.value}
                                    onClick={() => setFilterStatus(filter.value)}
                                    className={`px-4 py-3 rounded-xl font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${filterStatus === filter.value
                                            ? 'bg-pink-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter.value !== 'all' && getStatusIcon(filter.value)}
                                    {filter.label} ({filter.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
                        <p className="text-gray-600 mb-6">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
                        <button className="bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors">
                            Mua sắm ngay
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                                        <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.statusText}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {order.date}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Số sản phẩm</div>
                                        <div className="font-semibold text-gray-900">{order.items} sản phẩm</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Tổng tiền</div>
                                        <div className="font-semibold text-pink-600 text-lg">{order.total.toLocaleString()}₫</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Thanh toán</div>
                                        <div className="font-semibold text-gray-900">{order.paymentMethod}</div>
                                    </div>
                                </div>

                                {/* Product Preview */}
                                <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                                    {order.products.slice(0, 3).map((product, index) => (
                                        <img key={index} src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                                    ))}
                                    {order.products.length > 3 && (
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                                            +{order.products.length - 3}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="bg-pink-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-pink-700 transition-colors flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Xem chi tiết
                                        </button>
                                        {order.status === 'delivered' && (
                                            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                                <RotateCcw className="w-4 h-4" />
                                                Mua lại
                                            </button>
                                        )}
                                    </div>

                                    {order.status === 'shipping' && (
                                        <button className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
                                            <Truck className="w-4 h-4" />
                                            Theo dõi đơn hàng
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Detail Modal */}
                {selectedOrder && (
                    <OrderDetailModal
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default MyOrders;