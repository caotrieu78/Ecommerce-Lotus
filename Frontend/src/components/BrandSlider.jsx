import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PATHS } from "../constants/paths";
import SellerService from "../services/SellerService"; // <- Thêm dòng này

import "swiper/css";
import "swiper/css/navigation";

// Hàm tạo slug từ tên thương hiệu
const slugify = (text) =>
    text
        .toLowerCase()
        .replace(/\s+/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const BrandSlider = () => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await SellerService.getAll(); // gọi API thật
                setBrands(res || []);
            } catch (error) {
                console.error("Lỗi khi lấy brand:", error);
            }
        };

        fetchBrands();
    }, []);

    return (
        <div className="container mx-auto px-4">
            <div className="relative px-6 py-4 bg-gradient-to-r from-orange-100 via-pink-200 to-pink-300 rounded-xl shadow-md">
                {/* Background decorative circles */}
                <div className="hidden md:block absolute w-72 h-72 bg-pink-300 rounded-full opacity-30 top-0 left-0 -translate-x-1/3 -translate-y-1/2 pointer-events-none z-[-10]" />
                <div className="hidden md:block absolute w-72 h-72 bg-rose-300 rounded-full opacity-30 bottom-0 right-0 translate-x-1/3 translate-y-1/2 pointer-events-none z-[-10]" />

                {/* Left content */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col items-start gap-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Thương hiệu</h2>
                    <button className="px-4 py-1.5 bg-pink-500 text-white text-sm rounded-full hover:bg-pink-600 transition">
                        XEM NGAY
                    </button>
                    <div className="flex gap-x-2 mt-2">
                        <button className="custom-prev bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
                            <FaChevronLeft />
                        </button>
                        <button className="custom-next bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                {/* Swiper */}
                <div className="pl-44">
                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl: ".custom-prev",
                            nextEl: ".custom-next",
                        }}
                        spaceBetween={20}
                        slidesPerView={6}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 5 },
                            1280: { slidesPerView: 6 },
                        }}
                    >
                        {brands.map((brand, index) => {
                            const slug = slugify(brand.StoreName);
                            return (
                                <SwiperSlide key={index} className="py-2 overflow-visible">
                                    <Link to={PATHS.BRAND_DETAIL(brand.SellerID)}>
                                        <div className="flex flex-col items-center group cursor-pointer">
                                            <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full p-3 shadow-md border-2 border-transparent group-hover:border-pink-500 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 ease-in-out">
                                                <img
                                                    src={brand.LogoURL || "/images/no-logo.png"}
                                                    alt={brand.StoreName}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm md:text-base text-gray-800 text-center group-hover:text-pink-600 transition duration-300">
                                                {brand.StoreName}
                                            </p>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default BrandSlider;
