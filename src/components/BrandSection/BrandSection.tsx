// components/BrandSection/BrandSection.tsx
import React from 'react';
import { getFindManyProductBrandsQueryQueryKey, useFindManyProductBrandsQuery } from '../../services/api/ecommerce--api';
import { Env } from '../../env';
// import './BrandSection.css';

// const brands = [
//     { id: '1', name: 'Apple', logo: '/images/brands/apple.png' },
//     { id: '2', name: 'Samsung', logo: '/images/brands/samsung.png' },
//     { id: '3', name: 'Xiaomi', logo: '/images/brands/xiaomi.png' },
//     { id: '4', name: 'Asus', logo: '/images/brands/asus.png' },
//     { id: '5', name: 'HP', logo: '/images/brands/hp.png' },
//     { id: '6', name: 'Dell', logo: '/images/brands/dell.png' },
//     { id: '7', name: 'Lenovo', logo: '/images/brands/lenovo.png' },
//     { id: '8', name: 'Sony', logo: '/images/brands/sony.png' },
//     { id: '9', name: 'LG', logo: '/images/brands/lg.png' },
//     { id: '10', name: 'Huawei', logo: '/images/brands/huawei.png' },
// ];

const BrandSection: React.FC = () => {
    const brands = useFindManyProductBrandsQuery({ skip: 0, limit: 12 }, {
        query: {
            queryKey: getFindManyProductBrandsQueryQueryKey({ skip: 0, limit: 12 }),
            retry: 2,
            refetchOnWindowFocus: false
        }
    })

    return (
        <section className="brand-section py-8 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
                    محبوب ترین برند ها
                </h2>

                <div className="brands-grid grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                    {brands?.data?.data?.data?.map((brand) => (
                        <div
                            key={brand.id}
                            className="brand-item bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex items-center justify-center"
                        >
                            <img
                                src={Env.productBrands + brand.image}
                                alt={brand.title}
                                className="max-w-full max-h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-200"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandSection;