import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/ProductService";
import { PATHS } from "../constants/paths";
import ProductCard from "./ProductCard";

const FlashSaleSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const navigate = useNavigate();

  // Countdown setup
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 24); // đếm ngược 24h

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductService.getAll();
        const raw = Array.isArray(response) ? response : response?.data || [];
        setProducts(raw.slice(0, 5)); // Lấy đúng 5 sản phẩm đầu
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewAll = () => {
    navigate(PATHS.PRODUCTS);
  };

  const formatTime = (value) => value.toString().padStart(2, "0");

  return (
    <div className="w-full py-1">


      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-100 via-pink-200 to-pink-300 rounded-3xl shadow-md px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-pink-500 rounded-full"></span>
                <h2 className="text-pink-700 font-semibold text-xl sm:text-2xl">
                  Sản phẩm khuyến mãi
                </h2>
              </div>

              {/* Countdown */}
              <div className="flex gap-2 text-sm text-pink-700 ml-1 sm:ml-4">
                {["Ngày", "Giờ", "Phút", "Giây"].map((label, i) => (
                  <div
                    key={label}
                    className="bg-white bg-opacity-60 rounded-md px-2 py-1 text-center shadow-sm"
                  >
                    <div className="font-bold">
                      {formatTime(
                        [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][i]
                      )}
                    </div>
                    <div className="text-[10px] font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleViewAll}
              className="hidden sm:inline-block text-sm bg-white text-pink-600 border border-pink-500 hover:bg-pink-50 px-5 py-2 rounded-full transition"
            >
              Xem tất cả
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading ? (
              <div className="col-span-full text-center text-gray-500 py-6">Đang tải...</div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.ProductID} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-6">
                Không có sản phẩm nào.
              </div>
            )}
          </div>

          {/* Mobile button */}
          <div className="text-center sm:hidden mt-6">
            <button
              onClick={handleViewAll}
              className="text-pink-600 border border-pink-500 hover:bg-pink-50 px-6 py-2 rounded-full text-sm font-medium transition"
            >
              Xem tất cả
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default FlashSaleSection;
