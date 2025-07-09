import React from "react";

const ContentBannerSection = () => {
    return (
        <section className="py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <img
                        src="/images/content1.jpg"
                        alt="Content 1"
                        className="rounded-lg shadow-md w-full object-cover"
                    />
                    <img
                        src="/images/content2.jpg"
                        alt="Content 2"
                        className="rounded-lg shadow-md w-full object-cover"
                    />
                </div>

                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mt-10">
                    Bài Viết Mới Nhất
                </h2>
            </div>
        </section>
    );
};

export default ContentBannerSection;
