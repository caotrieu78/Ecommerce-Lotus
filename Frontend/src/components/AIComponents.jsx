import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 as uuidv4 } from "uuid";
import mockComments from "../data/mock_comments.json";

import ProductCard from "../components/ProductCard";
import UserService from "../services/userService";

// Import Swiper styles
import "swiper/css";
import ProductService from "../services/productService";

// SVG Icons
const Clock = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const Star = ({ className, fill = "none" }) => (
    <svg
        className={className}
        fill={fill}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
    </svg>
);

export const AIPersonalizedSection = ({ productId }) => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 4;

    // Kiểm tra đăng nhập
    const isLoggedIn = () => {
        const token = localStorage.getItem("access_token");
        return !!token;
    };

    // Lấy tên người dùng
    const getCurrentUserName = async () => {
        if (!isLoggedIn()) return "Khách";
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) throw new Error("Không tìm thấy userId");
            const user = await UserService.getById(userId);
            return user.name || user.username || "Khách";
        } catch (err) {
            console.error("Lỗi lấy thông tin người dùng:", err);
            return "Khách";
        }
    };

    // Hàm enrichProductData
    const enrichProductData = useCallback((products) => {
        return products.map((product) => {
            const variant = product.Variants?.length
                ? [...product.Variants].sort((a, b) => a.Price - b.Price)[0]
                : { Price: product.Price || 0 };
            return {
                ...product,
                id: product.ProductID || product.id,
                name: product.name || product.title || "Sản phẩm không tên",
                price: variant.Price || 0,
                image: product.image || product.imageUrl || "/fallback-image.jpg",
                SelectedVariant: variant
            };
        });
    }, []);

    // Tải sản phẩm từ API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await ProductService.getAll();
                const rawProducts = Array.isArray(response)
                    ? response
                    : response?.data || [];
                const enrichedProducts = enrichProductData(rawProducts);
                setRecommendations(enrichedProducts);
            } catch (err) {
                console.error("Lỗi khi tải sản phẩm:", err);
                setError("Không thể tải sản phẩm.");
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: err.message || "Không thể tải sản phẩm.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [enrichProductData]);

    // Tải đánh giá và bình luận
    useEffect(() => {
        try {
            // Lấy ratings từ localStorage và lọc giá trị hợp lệ
            const storedRatings = JSON.parse(
                localStorage.getItem(`ratings_${productId}`) || "[]"
            ).filter((r) => r.rating >= 1 && r.rating <= 5);

            // Lấy comments từ localStorage và lọc giá trị hợp lệ
            const storedComments = JSON.parse(
                localStorage.getItem(`comments_${productId}`) || "[]"
            ).filter(
                (c) => c.rating === undefined || (c.rating >= 1 && c.rating <= 5)
            );

            // Lấy comments từ mockComments và lọc giá trị hợp lệ
            const initialComments = mockComments.filter(
                (c) =>
                    c.productId === parseInt(productId) &&
                    (c.rating === undefined || (c.rating >= 1 && c.rating <= 5))
            );

            // Gộp comments, tránh trùng lặp
            const mergedComments = [
                ...storedComments,
                ...initialComments.filter(
                    (ic) => !storedComments.some((sc) => sc.id === ic.id)
                )
            ];

            // Lưu lại comments vào localStorage
            localStorage.setItem(
                `comments_${productId}`,
                JSON.stringify(mergedComments)
            );
            localStorage.setItem(
                `ratings_${productId}`,
                JSON.stringify(storedRatings)
            );

            setRatings(storedRatings);
            setComments(mergedComments);

            // Debug: In ra ratings và comments để kiểm tra
            console.log("Loaded ratings:", storedRatings);
            console.log("Loaded comments:", mergedComments);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu:", err);
            setError("Không thể tải bình luận hoặc đánh giá.");
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể tải bình luận hoặc đánh giá.",
                timer: 2000,
                showConfirmButton: false
            });
        }
    }, [productId]);

    // Gửi đánh giá và bình luận
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) {
            Swal.fire({
                icon: "warning",
                title: "Vui lòng đăng nhập!",
                text: "Bạn cần đăng nhập để đánh giá hoặc bình luận.",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
        if (!newComment.trim() && selectedRating === 0) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Vui lòng nhập bình luận hoặc chọn số sao!",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
        const userId = localStorage.getItem("userId");
        if (
            comments.some((c) => c.userId === userId) ||
            ratings.some((r) => r.userId === userId)
        ) {
            Swal.fire({
                icon: "warning",
                title: "Lỗi",
                text: "Bạn đã gửi đánh giá hoặc bình luận cho sản phẩm này!",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
        const userName = await getCurrentUserName();
        if (selectedRating > 0) {
            const newRating = {
                id: uuidv4(),
                rating: selectedRating,
                user: userName,
                userId,
                timestamp: new Date().toLocaleString("vi-VN")
            };
            const updatedRatings = [newRating, ...ratings];
            localStorage.setItem(
                `ratings_${productId}`,
                JSON.stringify(updatedRatings)
            );
            setRatings(updatedRatings);
        }
        if (newComment.trim()) {
            const newCommentObj = {
                id: uuidv4(),
                text: newComment,
                user: userName,
                userId,
                rating: selectedRating > 0 ? selectedRating : undefined,
                timestamp: new Date().toLocaleString("vi-VN")
            };
            const updatedComments = [newCommentObj, ...comments];
            localStorage.setItem(
                `comments_${productId}`,
                JSON.stringify(updatedComments)
            );
            setComments(updatedComments);
        }
        setNewComment("");
        setSelectedRating(0);
        setCurrentPage(1); // Reset to first page
        Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đã gửi đánh giá và bình luận của bạn!",
            timer: 2000,
            showConfirmButton: false
        });

        // Debug: In ra selectedRating sau khi submit
        console.log("Submitted rating:", selectedRating);
    };

    // Tính số sao trung bình
    const averageRating = ratings.length
        ? parseFloat(
            (
                ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            ).toFixed(1)
        )
        : 0;

    // Debug: In ra averageRating
    console.log("Average rating:", averageRating);

    // Phân trang bình luận
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(
        indexOfFirstComment,
        indexOfLastComment
    );
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-gradient-to-br from-gray-100 to-pink-50 rounded-2xl p-6 space-y-8 max-w-7xl mx-auto">
            <style>
                {`
          .font-japanese { font-family: 'Noto Sans JP', sans-serif; }
          @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
          .animate-slide-in { animation: slideIn 0.5s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.6s ease-out; }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
          .animate-pulse-hover:hover { animation: pulse 0.3s ease-in-out; }
          /* Override border from ProductCard */
          .product-card-no-border .product-card-inner {
            border: none !important;
            box-shadow: none !important;
          }
          .product-card-no-border .product-card-inner:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          }
        `}
            </style>
            {/* Sản phẩm gợi ý */}
            <div className="animate-slide-in">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6 font-japanese">
                    <Clock className="w-5 h-5 text-pink-500" />
                    Sản phẩm gợi ý
                </h2>
                {loading ? (
                    <p className="text-center py-8 text-pink-600 font-semibold text-base">
                        Đang tải gợi ý...
                    </p>
                ) : error ? (
                    <p className="text-center py-8 text-pink-600 font-semibold text-base">
                        {error}
                    </p>
                ) : recommendations.length > 0 ? (
                    <Swiper
                        modules={[]}
                        spaceBetween={15}
                        slidesPerView={5}
                        breakpoints={{
                            320: { slidesPerView: 2, spaceBetween: 8 },
                            640: { slidesPerView: 3, spaceBetween: 12 },
                            1024: { slidesPerView: 5, spaceBetween: 15 }
                        }}
                        className="mySwiper"
                    >
                        {recommendations.map((product) => (
                            <SwiperSlide key={product.id}>
                                <div className="min-h-[280px] h-full max-w-[200px] mx-auto flex flex-col justify-between p-2 bg-white">
                                    <div className="product-card-no-border">
                                        <ProductCard
                                            product={product}
                                            className="product-card-inner"
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-center py-8 text-pink-600 font-semibold text-base">
                        Không có sản phẩm gợi ý.
                    </p>
                )}
            </div>
            {/* Đánh giá và Bình luận */}
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3 mb-8 font-japanese bg-gradient-to-r from-gray-50 to-pink-50 py-3 rounded-lg shadow-sm">
                    <Star className="w-6 h-6 text-pink-500" />
                    Đánh giá & Bình luận
                </h2>
                <div className="bg-white rounded-xl p-5 shadow-lg">
                    {/* Đánh giá trung bình */}
                    <div className="mb-6 flex items-center justify-center gap-4">
                        {ratings.length > 0 ? (
                            <>
                                <span className="text-2xl font-bold text-gray-800">
                                    {averageRating} / 5
                                </span>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={`avg-star-${i}`}
                                            className={`w-5 h-5 ${i < Math.round(averageRating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                                } hover:scale-110 hover:text-yellow-500 transition-all duration-200 animate-pulse-hover`}
                                            fill={
                                                i < Math.round(averageRating) ? "currentColor" : "none"
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    ({ratings.length} đánh giá)
                                </span>
                            </>
                        ) : (
                            <span className="text-sm text-gray-600">
                                Chưa có đánh giá nào
                            </span>
                        )}
                    </div>
                    {/* Form đánh giá và bình luận */}
                    <form onSubmit={handleSubmit} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-gray-700 font-japanese">
                                Đánh giá:
                            </span>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <button
                                        key={`select-star-${i}`}
                                        type="button"
                                        onClick={() => {
                                            const newRating = i + 1 === selectedRating ? 0 : i + 1;
                                            setSelectedRating(newRating);
                                            console.log("Selected rating:", newRating);
                                        }}
                                        className={`w-6 h-6 ${i < selectedRating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                            } hover:scale-110 hover:text-yellow-500 transition-all duration-200 animate-pulse-hover`}
                                        aria-label={`Chọn ${i + 1} sao`}
                                        aria-selected={i < selectedRating}
                                    >
                                        <Star
                                            className="w-full h-full"
                                            fill={i < selectedRating ? "currentColor" : "none"}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận của bạn..."
                            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 font-japanese resize-none transition-all duration-300 bg-gray-50"
                            rows="4"
                            aria-label="Nhập bình luận sản phẩm"
                        />
                        <button
                            type="submit"
                            className="mt-3 bg-gradient-to-r from-pink-600 to-pink-800 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:from-pink-700 hover:to-pink-900 hover:shadow-xl hover:scale-102 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 animate-pulse-hover"
                            aria-label="Gửi đánh giá và bình luận"
                        >
                            Gửi
                        </button>
                    </form>
                    {/* Danh sách bình luận */}
                    <div className="space-y-4">
                        {currentComments.length > 0 ? (
                            currentComments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="p-4 bg-gradient-to-br from-gray-50 to-pink-50 rounded-lg shadow-sm hover:ring-1 hover:ring-pink-200 transition-all duration-300 animate-fade-in"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-pink-500" />
                                            <span className="text-sm font-semibold text-gray-800 font-japanese">
                                                {comment.user}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-600 italic font-japanese">
                                            {comment.timestamp}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        {comment.rating ? (
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={`comment-star-${comment.id}-${i}`}
                                                        className={`w-4 h-4 ${i < comment.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                            }`}
                                                        fill={i < comment.rating ? "currentColor" : "none"}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500 font-japanese">
                                                Chưa đánh giá
                                            </span>
                                        )}
                                        <p className="text-sm text-gray-700 font-japanese flex-1">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 font-japanese text-center">
                                Chưa có bình luận nào.
                            </p>
                        )}
                    </div>
                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={`page-${i + 1}`}
                                    onClick={() => paginate(i + 1)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${currentPage === i + 1
                                        ? "bg-pink-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-pink-100"
                                        } transition-all duration-300`}
                                    aria-label={`Trang ${i + 1}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
