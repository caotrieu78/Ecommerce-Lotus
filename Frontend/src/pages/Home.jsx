import React from "react";
import SliderSection from "../components/SliderSection";
import ProductList from "./Product/ProductList";
import FlashSaleSection from "../components/FlashSaleSection";
import Category from "../components/Category";
import SuggestedProducts from "../components/SuggestedProducts";
import BrandSlider from "../components/BrandSlider";
import VoucherSection from "../components/VoucherSection";

const Home = () => {
    return (
        <div>
            <SliderSection />
            <Category />
            <FlashSaleSection />
            {/* <VoucherSection /> */}
            <SuggestedProducts title="Bạn có thể thích" limit={5} />
            <BrandSlider />
            <ProductList />
        </div>
    );
};

export default Home;
