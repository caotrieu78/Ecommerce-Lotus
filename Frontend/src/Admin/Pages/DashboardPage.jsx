import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    Users,
    DollarSign,
    Package,
    TrendingUp,
    TrendingDown,
    Eye,
    Calendar,
    CreditCard,
    Truck,
    X,
    Clock,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        revenue: 123456789,
        orders: 248,
        users: 1024,
        products: 540
    });

    const [todayStats, setTodayStats] = useState({
        revenue: 2450000,
        orders: 24,
        revenueChange: 12.5,
        ordersChange: -2.3
    });

    const [orderStatus, setOrderStatus] = useState({
        unpaid: 82,
        undelivered: 82,
        shipping: 15,
        cancelled: 3
    });

    const recentOrders = [
        { id: 10001, total: 100000, status: 'completed', customer: 'Nguyễn Văn A' },
        { id: 10002, total: 110000, status: 'processing', customer: 'Trần Thị B' },
        { id: 10003, total: 120000, status: 'shipping', customer: 'Lê Văn C' },
        { id: 10004, total: 130000, status: 'completed', customer: 'Phạm Thị D' },
        { id: 10005, total: 140000, status: 'processing', customer: 'Hoàng Văn E' }
    ];

    const topProducts = [
        { name: 'Bánh trứng Manna Bolo 36g', sold: 156, revenue: 10608000, image: '/api/placeholder/50/50' },
        { name: 'Sữa tắm Dove 250ml', sold: 89, revenue: 40050000, image: '/api/placeholder/50/50' },
        { name: 'Tã em bé Pampers L', sold: 67, revenue: 21440000, image: '/api/placeholder/50/50' },
        { name: 'Máy lọc không khí Xiaomi', sold: 23, revenue: 66470000, image: '/api/placeholder/50/50' }
    ];

    const monthlyData = [
        { month: 'T1', orders: 30, revenue: 15000000 },
        { month: 'T2', orders: 45, revenue: 22000000 },
        { month: 'T3', orders: 60, revenue: 35000000 },
        { month: 'T4', orders: 40, revenue: 28000000 },
        { month: 'T5', orders: 90, revenue: 45000000 },
        { month: 'T6', orders: 75, revenue: 38000000 },
        { month: 'T7', orders: 100, revenue: 52000000 }
    ];

    const statsConfig = [
        {
            label: "Tổng doanh thu",
            value: `${stats.revenue.toLocaleString()}₫`,
            icon: <DollarSign className="w-6 h-6" />,
            bg: "from-green-400 to-emerald-500",
            textColor: "text-white",
            change: "+15.3%",
            changeType: "up"
        },
        {
            label: "Tổng đơn hàng",
            value: stats.orders.toLocaleString(),
            icon: <ShoppingCart className="w-6 h-6" />,
            bg: "from-blue-400 to-cyan-500",
            textColor: "text-white",
            change: "+8.2%",
            changeType: "up"
        },
        {
            label: "Người dùng",
            value: stats.users.toLocaleString(),
            icon: <Users className="w-6 h-6" />,
            bg: "from-purple-400 to-indigo-500",
            textColor: "text-white",
            change: "+23.1%",
            changeType: "up"
        },
        {
            label: "Sản phẩm",
            value: stats.products.toLocaleString(),
            icon: <Package className="w-6 h-6" />,
            bg: "from-orange-400 to-red-500",
            textColor: "text-white",
            change: "+4.7%",
            changeType: "up"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            case 'shipping': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Hoàn thành';
            case 'processing': return 'Đang xử lý';
            case 'shipping': return 'Đang giao';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trang tổng quan</h1>
                        <p className="text-gray-600">Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsConfig.map((item, index) => (
                        <div key={index} className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} opacity-90`}></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 bg-white/20 backdrop-blur-sm rounded-xl ${item.textColor}`}>
                                        {item.icon}
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${item.textColor}`}>
                                        {item.changeType === 'up' ? (
                                            <ArrowUpRight className="w-4 h-4" />
                                        ) : (
                                            <ArrowDownRight className="w-4 h-4" />
                                        )}
                                        {item.change}
                                    </div>
                                </div>
                                <div className={`${item.textColor}`}>
                                    <p className="text-sm opacity-90 mb-1">{item.label}</p>
                                    <p className="text-2xl font-bold">{item.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Today's Performance */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Kết quả hôm nay</h3>
                            <BarChart3 className="w-5 h-5 text-gray-600" />
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-600 mb-1">Doanh thu hôm nay</p>
                                        <p className="text-2xl font-bold text-green-700">{todayStats.revenue.toLocaleString()}₫</p>
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${todayStats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {todayStats.revenueChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {Math.abs(todayStats.revenueChange)}%
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600 mb-1">Đơn hàng hôm nay</p>
                                        <p className="text-2xl font-bold text-blue-700">{todayStats.orders}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${todayStats.ordersChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {todayStats.ordersChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        {Math.abs(todayStats.ordersChange)}%
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                                <Eye className="w-4 h-4" />
                                Xem báo cáo chi tiết
                            </button>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h3>
                            <ShoppingCart className="w-5 h-5 text-gray-600" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <CreditCard className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-yellow-600">Chưa thanh toán</p>
                                        <p className="text-xl font-bold text-yellow-700">{orderStatus.unpaid}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Truck className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-600">Chưa giao hàng</p>
                                        <p className="text-xl font-bold text-blue-700">{orderStatus.undelivered}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Clock className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-green-600">Đang giao hàng</p>
                                        <p className="text-xl font-bold text-green-700">{orderStatus.shipping}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <X className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-red-600">Hủy đơn</p>
                                        <p className="text-xl font-bold text-red-700">{orderStatus.cancelled}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
                            <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">Xem tất cả</button>
                        </div>

                        <div className="space-y-3">
                            {recentOrders.map((order, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-900">ĐH #{order.id}</p>
                                        <p className="text-sm text-gray-600">{order.customer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{order.total.toLocaleString()}₫</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Monthly Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Thống kê theo tháng</h3>
                            <TrendingUp className="w-5 h-5 text-gray-600" />
                        </div>

                        <div className="space-y-4">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-medium text-pink-600">{data.month}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{data.orders} đơn hàng</p>
                                            <p className="text-xs text-gray-600">{data.revenue.toLocaleString()}₫</p>
                                        </div>
                                    </div>
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${(data.orders / 100) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
                            <Package className="w-5 h-5 text-gray-600" />
                        </div>

                        <div className="space-y-4">
                            {topProducts.map((product, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                                        <p className="text-xs text-gray-600">Đã bán: {product.sold}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 text-sm">{product.revenue.toLocaleString()}₫</p>
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <TrendingUp className="w-3 h-3" />
                                            #{index + 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;