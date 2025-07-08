import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const categories = [
    {
        title: "Thực phẩm",
        image: "/images/Cate1.png",
        link: "#",
    },
    {
        title: "Mẹ và bé",
        image: "/images/Cate2.png",
        link: "#",
    },
    {
        title: "Hóa mỹ phẩm",
        image: "/images/Cate3.png",
        link: "#",
    },
    {
        title: "Nhà cửa đời sống",
        image: "/images/Cate4.png",
        link: "#",
    },
];

const Category = () => {
    return (
        <div
            className="relative py-6 sm:py-8 px-4"

        >
            {/* Hoa trang trí */}
            <img
                src="/images/bongphai.png"
                alt="hoa trái"
                className="absolute top-[70px] left-0 sm:top-[70px] sm:left-0 w-28 sm:w-36 md:w-44 pointer-events-none select-none z-0"
            />
            <img
                src="/images/bongtrai.png"
                alt="hoa phải"
                className="absolute top-[10px] right-0 sm:top-[20px] sm:right-0 w-28 sm:w-36 md:w-44 pointer-events-none select-none z-0"
            />

            {/* Tiêu đề */}
            <div className="text-left mb-2 max-w-6xl mx-auto px-2 sm:px-4">
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 tracking-wide">
                    Danh mục sản phẩm
                </h2>
                <div className="w-16 h-1 mt-1 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"></div>
            </div>

            {/* Danh sách danh mục - Swiper Carousel */}
            <div className="max-w-6xl mx-auto relative z-10">
                <Swiper
                    spaceBetween={16}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={index}>
                            <a
                                href={category.link}
                                className="group relative text-center transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 no-underline"
                            >
                                {/* Hình ảnh sản phẩm */}
                                <div className="mb-[-35px] z-20 relative">
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                        className="mx-auto h-36 object-contain transition-all duration-500 ease-in-out group-hover:scale-125 group-hover:drop-shadow-2xl"
                                        style={{
                                            filter: 'drop-shadow(0 10px 20px rgba(255, 182, 193, 0.3))',
                                        }}
                                    />

                                </div>

                                {/* Khối nền */}
                                <div
                                    className="h-[80px] flex items-end justify-center px-4 mt-[-30px] rounded-3xl relative z-10 transition-all duration-500 group-hover:shadow-2xl ring-1 ring-gray-200 ring-offset-2 bg-white"
                                    style={{
                                        backdropFilter: 'blur(6px)',
                                        boxShadow: `
                                            0 10px 20px rgba(0, 0, 0, 0.05),
                                            0 4px 6px rgba(0, 0, 0, 0.08),
                                            inset 0 1px 2px rgba(255,255,255,0.3)
                                        `,
                                        border: '1px solid rgba(230, 230, 230, 0.5)',
                                    }}
                                >
                                    <h3
                                        className="text-base font-bold text-gray-800 mb-3 group-hover:text-pink-500 transition-all duration-500"
                                        style={{
                                            textDecoration: 'none',
                                            textShadow: '0 0 10px rgba(255, 182, 193, 0.4)',
                                        }}
                                    >
                                        {category.title}
                                    </h3>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            {/* Custom animation keyframes (nếu cần dùng sau này) */}
            <style jsx>{`
                @keyframes spin {
                    from { transform: translateX(-50%) rotate(0deg); }
                    to { transform: translateX(-50%) rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Category;
