import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Search,
    ShoppingBag,
    UserCircle,
    Heart,
    Bell,
    List,
    ChevronRight,
    BadgeCheck,
    Truck,
    CheckCircle,
    Menu,
    X,
    LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CartPanel from "./CartPanel";
import { CartContext } from "../context/CartContext";
import { PATHS } from "../constants/paths";
import { Link } from "react-router-dom";

const categories = [
    "Thực phẩm",
    "Mẹ và Bé",
    "Hóa mỹ phẩm",
    "Nhà cửa đời sống",
    "Thực phẩm bảo vệ sức khỏe",
    "Sản phẩm khuyến mãi",
    "Hàng mới về"
];

const Header = () => {
    const { cartItemCount } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const menuRef = useRef();
    const userMenuRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        setUser(null);
        setIsUserMenuOpen(false);
    };

    const goTo = (path) => {
        navigate(path);
        setIsUserMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md">
            {/* Top Header */}
            <div className="bg-pink-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                    {/* Logo */}
                    <Link to="/" className="flex items-center flex-shrink-0">
                        <img src="/images/logo.png" alt="Logo" className="h-12 mr-2" />
                    </Link>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 mx-4 lg:mx-10 max-w-xl">
                        <div className="w-full flex rounded-lg shadow-sm overflow-hidden">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="flex-1 px-4 py-2 border border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                            <button className="bg-pink-600 text-white px-4 hover:bg-pink-700 transition">
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* User Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <div
                                onClick={() =>
                                    user ? setIsUserMenuOpen(!isUserMenuOpen) : navigate("/login")
                                }
                                className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
                                title={user ? user.FullName || user.Username : "Đăng nhập"}
                            >
                                <div className="w-8 h-8 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full">
                                    {user ? (
                                        (user.FullName || user.Username).charAt(0).toUpperCase()
                                    ) : (
                                        <UserCircle className="w-5 h-5" />
                                    )}
                                </div>
                                <span className="text-sm text-gray-800 font-medium hidden sm:inline">
                                    {user
                                        ? user.FullName || user.Username
                                        : "Đăng nhập / Đăng ký"}
                                </span>
                            </div>

                            {user && isUserMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <p className="font-semibold text-gray-800">
                                            {user.FullName || user.Username}
                                        </p>
                                    </div>
                                    <ul className="py-2">
                                        <li
                                            onClick={() => goTo(PATHS.ACCOUNT)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                                        >
                                            <UserCircle className="w-5 h-5 text-gray-500" />
                                            <span>Thông tin tài khoản</span>
                                        </li>
                                        <li
                                            onClick={() => goTo(PATHS.MY_ORDERS)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                                        >
                                            <Truck className="w-5 h-5 text-gray-500" />
                                            <span>Đơn hàng của tôi</span>
                                        </li>
                                        <li
                                            onClick={() => goTo(PATHS.FAVORITES)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                                        >
                                            <Heart className="w-5 h-5 text-gray-500" />
                                            <span>Sản phẩm yêu thích</span>
                                        </li>
                                        <li
                                            onClick={() => goTo("/notifications")}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700"
                                        >
                                            <Bell className="w-5 h-5 text-gray-500" />
                                            <span>Thông báo</span>
                                        </li>
                                        <li
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-600"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Đăng xuất</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Favorites */}
                        <button
                            onClick={() => navigate("/favorites")}
                            className="hidden lg:flex items-center text-gray-800 hover:text-pink-600 transition"
                        >
                            <Heart className="w-6 h-6" />
                        </button>

                        {/* Notifications */}
                        <button
                            onClick={() => navigate("/notifications")}
                            className="hidden lg:flex items-center text-gray-800 hover:text-pink-600 transition"
                        >
                            <Bell className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        {/* Cart Icon with animation */}
                        <motion.div
                            onClick={() => setIsCartOpen(true)}
                            className="relative cursor-pointer text-gray-800 hover:text-pink-600 transition"
                            whileTap={{ x: [-10, 0], transition: { duration: 0.3 } }}
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </motion.div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-800 hover:text-pink-700 transition"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden px-4 pb-3">
                    <div className="flex rounded-lg shadow-sm overflow-hidden">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="flex-1 px-4 py-2 border border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                        <button className="bg-pink-600 text-white px-4 hover:bg-pink-700 transition">
                            <Search size={18} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                        <div className="px-4 py-4 space-y-2">
                            <button
                                onClick={() => {
                                    navigate("/favorites");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition"
                            >
                                <Heart className="w-6 h-6 text-pink-600" />
                                <span>Sản phẩm yêu thích</span>
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/notifications");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition"
                            >
                                <Bell className="w-6 h-6 text-pink-600" />
                                <span>Thông báo</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Header */}
            <div className="bg-pink-600">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 text-white text-sm font-medium">
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center px-3 py-2 hover:bg-pink-700 rounded-md transition"
                        >
                            <List className="w-5 h-5 mr-2" />
                            <span className="hidden sm:inline">DANH MỤC SẢN PHẨM</span>
                            <span className="sm:hidden">DANH MỤC</span>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
                                <ul className="divide-y divide-gray-100 text-gray-800">
                                    {categories.map((cat, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                        >
                                            {cat}
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="hidden lg:flex gap-6">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="w-5 h-5 text-white" />
                            <span>Đảm bảo chất lượng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-white" />
                            <span>Miễn phí vận chuyển</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-white" />
                            <span>Mở hộp kiểm tra nhận hàng</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-pink-600 px-4 py-1 rounded-md hover:bg-gray-100 hover:text-pink-700 transition shadow-sm">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Live stream</span>
                    </button>
                </div>
            </div>

            {/* Cart Panel */}
            <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header>
    );
};

export default Header;
