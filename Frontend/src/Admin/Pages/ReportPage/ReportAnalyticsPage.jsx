import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Filter,
    Download,
    FileText,
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    RotateCcw,
    CreditCard,
    MapPin,
    Globe,
    ChevronDown,
    RefreshCw,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Activity,
    Users
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportAnalyticsPage = () => {
    const [overview, setOverview] = useState({
        totalRevenue: 123456789,
        totalOrders: 248,
        byStatus: []
    });
    const [monthly, setMonthly] = useState([
        { month: 1, revenue: 15000000, orders: 30, customers: 25 },
        { month: 2, revenue: 22000000, orders: 45, customers: 38 },
        { month: 3, revenue: 35000000, orders: 60, customers: 52 },
        { month: 4, revenue: 28000000, orders: 40, customers: 35 },
        { month: 5, revenue: 45000000, orders: 90, customers: 75 },
        { month: 6, revenue: 38000000, orders: 75, customers: 63 },
        { month: 7, revenue: 52000000, orders: 100, customers: 85 }
    ]);
    const [categoryData, setCategoryData] = useState([
        { name: 'Thực phẩm', value: 35, sales: 45000000, color: '#0088FE' },
        { name: 'Hóa mỹ phẩm', value: 25, sales: 32000000, color: '#00C49F' },
        { name: 'Mẹ và bé', value: 20, sales: 26000000, color: '#FFBB28' },
        { name: 'Nhà cửa đời sống', value: 15, sales: 19000000, color: '#FF8042' },
        { name: 'Khác', value: 5, sales: 6000000, color: '#8884D8' }
    ]);
    const [channelData, setChannelData] = useState([
        { name: 'Website', orders: 120, revenue: 45000000 },
        { name: 'Mobile App', orders: 85, revenue: 32000000 },
        { name: 'Facebook', orders: 60, revenue: 22000000 },
        { name: 'Zalo', orders: 45, revenue: 18000000 },
        { name: 'Phone', orders: 30, revenue: 12000000 }
    ]);
    const [customerData, setCustomerData] = useState([
        { type: 'Khách hàng mới', count: 156, percentage: 65 },
        { type: 'Khách hàng cũ', count: 84, percentage: 35 }
    ]);
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(null);
    const [branchFilter, setBranchFilter] = useState([]);
    const [channelFilter, setChannelFilter] = useState([]);
    const [showBranchFilter, setShowBranchFilter] = useState(false);
    const [showChannelFilter, setShowChannelFilter] = useState(false);

    const branches = ["Tất cả", "Địa điểm mặc định"];
    const channels = ["Website", "POS", "Facebook", "Draft", "Zalo", "Phone"];

    const formatCurrency = (val) => `${val.toLocaleString()}₫`;

    const fetchStats = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const exportPDF = () => {
        console.log('Exporting PDF...');
    };

    const exportExcel = () => {
        console.log('Exporting Excel...');
    };

    const statsCards = [
        {
            title: "Số đơn hàng",
            value: overview.totalOrders.toLocaleString(),
            icon: <ShoppingCart className="w-6 h-6" />,
            color: "from-blue-400 to-cyan-500",
            change: "+12.5%",
            changeType: "up"
        },
        {
            title: "Hoàn trả",
            value: "0₫",
            icon: <RotateCcw className="w-6 h-6" />,
            color: "from-red-400 to-pink-500",
            change: "0%",
            changeType: "neutral"
        },
        {
            title: "Doanh thu thuần",
            value: formatCurrency(overview.totalRevenue),
            icon: <DollarSign className="w-6 h-6" />,
            color: "from-green-400 to-emerald-500",
            change: "+18.2%",
            changeType: "up"
        },
        {
            title: "Thực nhận",
            value: "0₫",
            icon: <CreditCard className="w-6 h-6" />,
            color: "from-purple-400 to-indigo-500",
            change: "0%",
            changeType: "neutral"
        }
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-pink-500" />
                            Báo cáo phân tích
                        </h1>
                        <p className="text-gray-600">Thống kê và phân tích dữ liệu kinh doanh chi tiết</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <FileText className="w-4 h-4" />
                            Xuất PDF
                        </button>
                        <button
                            onClick={exportExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Xuất Excel
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Year Filter */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Năm</label>
                            <div className="relative">
                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Month Filter */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tháng</label>
                            <div className="relative">
                                <select
                                    value={month || ""}
                                    onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)}
                                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                >
                                    <option value="">Tất cả</option>
                                    {months.map(m => (
                                        <option key={m} value={m}>Tháng {m}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="space-y-1">
                            <div className="h-5"></div>
                            <button
                                onClick={fetchStats}
                                disabled={loading}
                                className="flex items-center gap-2 bg-pink-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Filter className="w-4 h-4" />
                                )}
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statsCards.map((card, index) => (
                                <div key={index} className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`}></div>
                                    <div className="relative p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white">
                                                {card.icon}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-white">
                                                {card.changeType === 'up' ? (
                                                    <ArrowUpRight className="w-4 h-4" />
                                                ) : card.changeType === 'down' ? (
                                                    <ArrowDownRight className="w-4 h-4" />
                                                ) : null}
                                                {card.change}
                                            </div>
                                        </div>
                                        <div className="text-white">
                                            <p className="text-sm opacity-90 mb-1">{card.title}</p>
                                            <p className="text-2xl font-bold">{card.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Revenue Trend Chart */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-500" />
                                        Xu hướng doanh thu
                                    </h3>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthly}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                            labelFormatter={(label) => `Tháng ${label}`}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3B82F6"
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Orders vs Customers Chart */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-green-500" />
                                        Đơn hàng & Khách hàng
                                    </h3>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthly}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value, name) => [value, name === 'orders' ? 'Đơn hàng' : 'Khách hàng']}
                                            labelFormatter={(label) => `Tháng ${label}`}
                                        />
                                        <Legend />
                                        <Bar dataKey="orders" fill="#10B981" name="Đơn hàng" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="customers" fill="#6366F1" name="Khách hàng" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Category Distribution Pie Chart */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <PieChart className="w-5 h-5 text-purple-500" />
                                        Phân bố theo danh mục
                                    </h3>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex-1">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <RechartsPieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ']} />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="space-y-2">
                                        {categoryData.map((item, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: item.color }}
                                                ></div>
                                                <span className="text-gray-700">{item.name}</span>
                                                <span className="font-medium">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Channel Performance Chart */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-orange-500" />
                                        Hiệu suất kênh bán
                                    </h3>
                                </div>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={channelData} layout="horizontal">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === 'orders' ? `${value} đơn` : formatCurrency(value),
                                                name === 'orders' ? 'Đơn hàng' : 'Doanh thu'
                                            ]}
                                        />
                                        <Bar dataKey="orders" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Customer Analysis */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    Phân tích khách hàng
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {customerData.map((item, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium text-gray-900">{item.type}</span>
                                            <span className="text-2xl font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${index === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                                    }`}
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">{item.percentage}% tổng khách hàng</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt hiệu suất</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center p-4 bg-blue-50 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">
                                        {monthly.length > 0 ? Math.max(...monthly.map(m => m.revenue)).toLocaleString() : 0}₫
                                    </div>
                                    <div className="text-sm text-blue-600">Tháng cao nhất</div>
                                </div>

                                <div className="text-center p-4 bg-green-50 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600 mb-1">
                                        {monthly.length > 0 ? Math.round(monthly.reduce((sum, m) => sum + m.revenue, 0) / monthly.length).toLocaleString() : 0}₫
                                    </div>
                                    <div className="text-sm text-green-600">Trung bình/tháng</div>
                                </div>

                                <div className="text-center p-4 bg-purple-50 rounded-xl">
                                    <div className="text-2xl font-bold text-purple-600 mb-1">
                                        {monthly.length > 0 ? monthly.reduce((sum, m) => sum + m.orders, 0) : 0}
                                    </div>
                                    <div className="text-sm text-purple-600">Tổng đơn hàng</div>
                                </div>

                                <div className="text-center p-4 bg-orange-50 rounded-xl">
                                    <div className="text-2xl font-bold text-orange-600 mb-1">
                                        {categoryData.reduce((sum, cat) => sum + cat.sales, 0).toLocaleString()}₫
                                    </div>
                                    <div className="text-sm text-orange-600">Doanh thu theo danh mục</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportAnalyticsPage;