import React, { useState } from 'react';
import {
    Search,
    BarChart3,
    TrendingUp,
    FileText,
    Filter,
    Download,
    Plus,
    Eye,
    Calendar,
    User,
    Tag,
    ArrowUpRight,
    Clock,
    DollarSign,
    ShoppingCart,
    Globe,
    CreditCard
} from 'lucide-react';

const ReportPage = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(false);

    const mockData = [
        {
            key: "1",
            name: "Tháng hiện tại",
            category: "Bán hàng",
            lastViewed: "02/07/2025",
            createdBy: "Admin",
            description: "Báo cáo tổng quan về doanh số bán hàng trong tháng",
            icon: <TrendingUp className="w-5 h-5" />,
            color: "from-blue-400 to-cyan-500"
        },
        {
            key: "2",
            name: "Doanh thu theo thời gian giao và kho xuất",
            category: "Bán hàng",
            lastViewed: "--",
            createdBy: "Admin",
            description: "Phân tích doanh thu dựa trên thời gian giao hàng",
            icon: <BarChart3 className="w-5 h-5" />,
            color: "from-green-400 to-emerald-500"
        },
        {
            key: "3",
            name: "Công nợ khách hàng",
            category: "Tài chính",
            lastViewed: "--",
            createdBy: "Admin",
            description: "Theo dõi các khoản công nợ của khách hàng",
            icon: <CreditCard className="w-5 h-5" />,
            color: "from-purple-400 to-indigo-500"
        },
        {
            key: "4",
            name: "Công nợ nhà cung cấp",
            category: "Tài chính",
            lastViewed: "--",
            createdBy: "Admin",
            description: "Quản lý công nợ với các nhà cung cấp",
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-yellow-400 to-orange-500"
        },
        {
            key: "5",
            name: "Tổng doanh thu hàng hoá và thuế VAT",
            category: "Bán hàng",
            lastViewed: "--",
            createdBy: "Admin",
            description: "Báo cáo chi tiết về doanh thu và thuế VAT",
            icon: <ShoppingCart className="w-5 h-5" />,
            color: "from-red-400 to-pink-500"
        },
        {
            key: "6",
            name: "Hiệu quả khuyến mãi",
            category: "Bán hàng",
            lastViewed: "--",
            createdBy: "Admin",
            description: "Đánh giá hiệu quả các chương trình khuyến mãi",
            icon: <Tag className="w-5 h-5" />,
            color: "from-teal-400 to-cyan-500"
        },
        {
            key: "7",
            name: "Kênh sản thương mại điện tử",
            category: "Bán hàng",
            lastViewed: "--",
            createdBy: "Admin",
            description: "Phân tích hiệu suất các kênh thương mại điện tử",
            icon: <Globe className="w-5 h-5" />,
            color: "from-indigo-400 to-purple-500"
        },
        {
            key: "8",
            name: "PageViews-Tháng hiện tại",
            category: "Website",
            lastViewed: "--",
            createdBy: "Admin",
            description: "Thống kê lượt xem trang web trong tháng",
            icon: <Eye className="w-5 h-5" />,
            color: "from-pink-400 to-rose-500"
        }
    ];

    const categories = ["all", "Bán hàng", "Tài chính", "Website"];

    const categoryStats = {
        "Bán hàng": mockData.filter(item => item.category === "Bán hàng").length,
        "Tài chính": mockData.filter(item => item.category === "Tài chính").length,
        "Website": mockData.filter(item => item.category === "Website").length
    };

    const filteredData = mockData.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category) => {
        switch (category) {
            case "Bán hàng": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Tài chính": return "bg-purple-100 text-purple-700 border-purple-200";
            case "Website": return "bg-green-100 text-green-700 border-green-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Bán hàng": return <ShoppingCart className="w-4 h-4" />;
            case "Tài chính": return <DollarSign className="w-4 h-4" />;
            case "Website": return <Globe className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-pink-500" />
                            Danh sách báo cáo
                        </h1>
                        <p className="text-gray-600">Quản lý và theo dõi các báo cáo kinh doanh</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            Xuất báo cáo
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            Tạo báo cáo mới
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tổng báo cáo</p>
                                <p className="text-2xl font-bold text-gray-900">{mockData.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {Object.entries(categoryStats).map(([category, count]) => (
                        <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{category}</p>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${getCategoryColor(category).replace('text-', 'text-').replace('border-', '').replace('bg-', 'bg-').split(' ')[0]}`}>
                                    {getCategoryIcon(category)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Nhập tên báo cáo bạn muốn tìm..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filters */}
                        <div className="flex gap-2 overflow-x-auto">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${selectedCategory === category
                                            ? 'bg-pink-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {category !== "all" && getCategoryIcon(category)}
                                    {category === "all" ? "Tất cả" : category}
                                    {category !== "all" && (
                                        <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                                            {categoryStats[category]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reports Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="text-center py-16">
                        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy báo cáo</h3>
                        <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map((report) => (
                            <div key={report.key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
                                {/* Header với gradient */}
                                <div className={`h-24 bg-gradient-to-r ${report.color} p-4 flex items-center justify-between`}>
                                    <div className="text-white">
                                        {report.icon}
                                    </div>
                                    <button className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Report Name */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                                            {report.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                                    </div>

                                    {/* Category */}
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(report.category)}`}>
                                            {getCategoryIcon(report.category)}
                                            {report.category}
                                        </span>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>Xem: {report.lastViewed}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{report.createdBy}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <button className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            Xem báo cáo
                                        </button>
                                        <button className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                            <Download className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {filteredData.length > 6 && (
                    <div className="flex items-center justify-center space-x-2">
                        <button className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                            Trang trước
                        </button>
                        <div className="flex space-x-1">
                            {[1, 2, 3].map(page => (
                                <button key={page} className={`w-10 h-10 rounded-xl font-medium transition-colors ${page === 1 ? 'bg-pink-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                    }`}>
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                            Trang sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportPage;