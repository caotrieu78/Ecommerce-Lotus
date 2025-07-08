import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
    {
        image: "/images/slide_1_img.jpg",
        alt: "Japanese home decor items"
    },
    {
        image: "/images/slide_2_img.jpg",
        alt: "Japanese ceramic products"
    },
    {
        image: "/images/slide_3_img.jpg",
        alt: "Japanese stationery items"
    }
];

const staticBanners = [
    {
        image: "/images/slide_2_img.jpg",
        alt: "Japanese ceramic products"
    },
    {
        image: "/images/slide_3_img.jpg",
        alt: "Japanese stationery items"
    }
];

const SwiperSlider = () => {
    return (
        <section
            className="banner max-w-[1536px] mx-auto px-4 py-6 lg:py-8 rounded-xl font-sans"
            aria-label="Featured Japanese Products"
        >
            <div className="banner__container flex flex-col lg:flex-row gap-4 h-auto">
                {/* Swiper Section */}
                <div className="banner__swiper w-full lg:w-2/3 h-[200px] sm:h-[300px] lg:h-[400px] relative">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{
                            clickable: true,
                            el: ".banner__pagination",
                            type: "bullets"
                        }}
                        navigation={{
                            nextEl: ".banner__button-next",
                            prevEl: ".banner__button-prev"
                        }}
                        speed={800}
                        grabCursor={true}
                        className="swiper w-full h-full rounded-lg overflow-hidden"
                    >
                        {slides.map((slide, idx) => (
                            <SwiperSlide key={idx} className="swiper__slide">
                                <div className="swiper__image-container w-full h-full aspect-[12/5] flex items-center justify-center border border-pink-600 bg-pink-50 rounded-xl overflow-hidden shadow-sm">
                                    <img
                                        src={slide.image}
                                        alt={slide.alt}
                                        className="swiper__image w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}

                        {/* Pagination */}
                        <div className="banner__pagination absolute bottom-4 w-full flex justify-center gap-2 z-50" />

                        {/* Navigation Buttons */}
                        <div className="banner__button-prev hidden lg:flex absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-pink-50 text-pink-700 rounded-full items-center justify-center cursor-pointer z-50 transition-all duration-300 hover:bg-pink-200 hover:shadow-md">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>
                        <div className="banner__button-next hidden lg:flex absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-pink-50 text-pink-700 rounded-full items-center justify-center cursor-pointer z-50 transition-all duration-300 hover:bg-pink-200 hover:shadow-md">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </Swiper>
                </div>

                {/* Static Banners Section */}
                <div className="banner__static hidden lg:flex lg:w-1/3 h-[400px] flex-col gap-4">
                    {staticBanners.map((banner, idx) => (
                        <div
                            key={idx}
                            className="banner__static-item w-full h-1/2 aspect-[12/5] flex items-center justify-center rounded-xl overflow-hidden border border-pink-300 bg-pink-50"
                        >
                            <img
                                src={banner.image}
                                alt={banner.alt}
                                className="banner__static-image w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
        .banner__pagination .swiper-pagination-bullet {
          background-color: #d1d5db;
          width: 8px;
          height: 8px;
          margin: 0 4px;
          opacity: 0.6;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .banner__pagination .swiper-pagination-bullet-active {
          background-color: #ec4899;
          width: 10px;
          height: 10px;
          opacity: 1;
        }
      `}</style>
        </section>
    );
};

export default SwiperSlider;
