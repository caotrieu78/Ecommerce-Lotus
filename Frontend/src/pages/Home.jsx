import React from "react";
import SliderSection from "../components/SliderSection";
import FlashSaleSection from "../components/FlashSaleSection";
import Category from "../components/Category";
import SuggestedProducts from "../components/SuggestedProducts";
import BrandSlider from "../components/BrandSlider";
import CategoryProductSection from "../components/CategoryProductSection";

import ContentBannerSection from "../components/ContentBannerSection";
import ProductService from "../services/productService";

const Home = () => {
    // ✅ Không lọc theo tab
    const handleFetchAllProducts = async () => {
        const all = await ProductService.getAll();
        return all.map(p => ({
            ...p,
            SelectedVariant: p.Variants?.[0] ?? { Price: p.Price }
        }));
    };

    return (
        <div>
            <SliderSection />
            <Category />
            <FlashSaleSection />
            <SuggestedProducts title="Bạn có thể thích" limit={5} />
            <BrandSlider />



            <CategoryProductSection
                title="Thực phẩm"
                banner="/images/home_coll_1_banner1.jpg" // ✅ Đổi đúng tên ảnh banner của bạn
                tabs={["Thực phẩm chế biến", "Thực phẩm tươi", "Thực phẩm ăn liền"]}
                defaultTab="Thực phẩm chế biến"
                fetchProducts={handleFetchAllProducts} // ✅ Không lọc theo tab
                onViewAll={(tab) => console.log("Xem tất cả:", tab)}
            />

            <CategoryProductSection
                title="Mẹ & Bé"
                banner="/images/home_coll_2_banner2.jpg"
                tabs={["Sữa cho bé", "Bỉm/Tã", "Bánh & Kẹo", "Đồ dùng cho bé"]}
                defaultTab="Sữa cho bé"
                fetchProducts={handleFetchAllProducts} // ✅ Không lọc
                onViewAll={(tab) => console.log("Xem tất cả:", tab)}
            />

            <CategoryProductSection
                title="Hóa mỹ phẩm"
                banner="/images/home_coll_3_banner1.jpg"
                tabs={["Chăm sóc cơ thể", "Chăm sóc chuyên dụng"]}
                defaultTab="Chăm sóc cơ thể"
                fetchProducts={handleFetchAllProducts}
                onViewAll={(tab) => console.log("Xem tất cả:", tab)}
            />

            <CategoryProductSection
                title="Nhà cửa đời sống"
                banner="/images/home_coll_4_banner1.jpg"
                tabs={["Lọc nước", "Thiết bị tắm", "Dụng cụ nhà cửa"]}
                defaultTab="Lọc nước"
                fetchProducts={handleFetchAllProducts}
                onViewAll={(tab) => console.log("Xem tất cả:", tab)}
            />
            <ContentBannerSection />
        </div>
    );
};

export default Home;
