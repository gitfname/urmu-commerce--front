// components/FeaturedProduct/FeaturedProduct.tsx
import React from 'react';
// import './FeaturedProduct.css';

const FeaturedProduct: React.FC = () => {
    const featuredProduct = {
        title: 'لپ تاپ لنوو مدل Le740 s plus مخصوص گیم',
        englishTitle: 'Lenovo Le740 s plus gaming',
        currentPrice: 24400000,
        originalPrice: 27600000,
        features: ['طراحی زیبا', 'کارت گرافیک قدرتمند', 'حافظه SSD', 'صفحه نمایش لمسی'],
        image: '/images/laptop-featured.jpg'
    };

    const formatPrice = (price: number): string => {
        return price.toLocaleString('fa-IR');
    };

    return (
        <section className="featured-product py-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="container mx-auto px-4">
                <div className="featured-slider">
                    <div className="featured-item flex flex-col lg:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="featured-image lg:w-1/2">
                            <img
                                src={featuredProduct.image}
                                alt={featuredProduct.title}
                                className="w-full h-64 lg:h-96 object-cover"
                            />
                        </div>

                        <div className="featured-content lg:w-1/2 p-8">
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                                {featuredProduct.title}
                            </h3>

                            <p className="text-gray-600 mb-4">
                                {featuredProduct.englishTitle}
                            </p>

                            <div className="price-section mb-6">
                                <div className="current-price text-2xl font-bold text-green-600 mb-1">
                                    {formatPrice(featuredProduct.currentPrice)} تومان
                                </div>
                                <div className="original-price text-lg text-gray-500 line-through">
                                    {formatPrice(featuredProduct.originalPrice)} تومان
                                </div>
                            </div>

                            <div className="features mb-6">
                                <h4 className="font-semibold mb-3">ویژگی‌های محصول:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {featuredProduct.features.map((feature, index) => (
                                        <div key={index} className="feature-item flex items-center">
                                            <span className="text-green-500 mr-2">✓</span>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="cta-button bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                                مشاهده و خرید
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProduct;