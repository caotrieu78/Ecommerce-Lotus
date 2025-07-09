import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera, Check } from 'lucide-react';

const AccountInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0123 456 789",
        address: "123 Đường ABC, Quận XYZ, TP.HCM"
    });
    const [editedInfo, setEditedInfo] = useState(userInfo);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedInfo(userInfo);
    };

    const handleSave = () => {
        setUserInfo(editedInfo);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedInfo(userInfo);
        setIsEditing(false);
    };

    const handleInputChange = (field, value) => {
        setEditedInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin tài khoản</h1>
                    <p className="text-gray-600">Quản lý thông tin cá nhân và tùy chọn tài khoản của bạn</p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-8 border-b border-gray-100">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {userInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                                    <Camera className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{userInfo.name}</h2>
                                <p className="text-gray-600 mb-3">{userInfo.email}</p>
                                <div className="flex items-center gap-2">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                        <Check className="w-3 h-3 inline mr-1" />
                                        Đã xác thực
                                    </span>
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                        Thành viên từ 2024
                                    </span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="bg-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-pink-700 transition-colors flex items-center gap-2 shadow-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Chỉnh sửa
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                                        >
                                            <Save className="w-4 h-4" />
                                            Lưu
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-gray-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center gap-2 shadow-sm"
                                        >
                                            <X className="w-4 h-4" />
                                            Hủy
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Information Form */}
                    <div className="p-8">
                        <div className="grid gap-6">

                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <User className="w-4 h-4 text-gray-500" />
                                    Họ và tên
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedInfo.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="Nhập họ và tên"
                                    />
                                ) : (
                                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl">
                                        <span className="text-gray-900 font-medium">{userInfo.name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedInfo.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="Nhập địa chỉ email"
                                    />
                                ) : (
                                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl">
                                        <span className="text-gray-900 font-medium">{userInfo.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    Số điện thoại
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editedInfo.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="Nhập số điện thoại"
                                    />
                                ) : (
                                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl">
                                        <span className="text-gray-900 font-medium">{userInfo.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Address Field */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    Địa chỉ
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={editedInfo.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Nhập địa chỉ chi tiết"
                                    />
                                ) : (
                                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl">
                                        <span className="text-gray-900 font-medium">{userInfo.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="border-t border-gray-100 p-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tùy chọn tài khoản</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Security */}
                            <button className="text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Bảo mật</h4>
                                        <p className="text-sm text-gray-600">Đổi mật khẩu, xác thực 2 bước</p>
                                    </div>
                                </div>
                            </button>

                            {/* Notifications */}
                            <button className="text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                        <Mail className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Thông báo</h4>
                                        <p className="text-sm text-gray-600">Cài đặt email và SMS</p>
                                    </div>
                                </div>
                            </button>

                            {/* Privacy */}
                            <button className="text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                        <User className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Quyền riêng tư</h4>
                                        <p className="text-sm text-gray-600">Quản lý dữ liệu cá nhân</p>
                                    </div>
                                </div>
                            </button>

                            {/* Orders */}
                            <button className="text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                        <User className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">Đơn hàng</h4>
                                        <p className="text-sm text-gray-600">Lịch sử và theo dõi đơn hàng</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-sm transition-shadow">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <User className="w-6 h-6 text-pink-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Hồ sơ hoàn thiện</h3>
                        <p className="text-sm text-gray-600">85%</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-sm transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email đã xác thực</h3>
                        <p className="text-sm text-green-600">Đã xác nhận</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-sm transition-shadow">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">Số điện thoại</h3>
                        <p className="text-sm text-green-600">Đã xác thực</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;