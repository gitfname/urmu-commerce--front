import React, { useState } from 'react';
import ProductGallery from './components/ProductGallery/ProductGallery';
import ProductInfo from './components/ProductInfo/ProductInfo';
import ColorSelector from './components/ColorSelector/ColorSelector';
import PurchaseBox from './components/PurchaseBox/PurchaseBox';
import TabNavigation, { type TabType } from './components/TabNavigation/TabNavigation';
import SpecificationsTab from './components/Tabs/SpecificationsTab';
import CommentsTab from './components/Tabs/CommentsTab';
import QuestionsTab from './components/Tabs/QuestionsTab';
import type { Product, Breadcrumb, Review, Question } from './types/product';
import ServicesGrid from '../../components/ServicesGrid/ServicesGrid';
import { getFindProductByIdQueryQueryKey, useFindProductByIdQuery } from '../../services/api/ecommerce--api';
import { useParams } from 'react-router-dom';

interface SingleProductPageProps {
    product?: Product;
    breadcrumbs?: Breadcrumb[];
    reviews?: Review[];
    questions?: Question[];
}

const SingleProductPage: React.FC<SingleProductPageProps> = ({
    product = {
        // Default product data here...
        id: "1",
        title: "لپ تاپ 13.3 اینچی ایسوس مدل Zenbook S 13 OLED UX5304VA",
        englishTitle: "Asus Zenbook S 13 OLED UX5304VA-NQ003 13.3 Inch Laptop",
        rating: 4.3,
        reviewCount: 28,
        commentCount: 2,
        price: 1200000,
        stockCount: 2,
        warranty: "گارانتی 18 ماهه",
        deliveryTime: "ارسال 2 روز کاری",
        images: [
            { src: "/assets/image/products/9.webp", alt: "محصول اصلی" },
            { src: "/assets/image/products/91.jpg", alt: "تصویر 2" },
            { src: "/assets/image/products/92.jpg", alt: "تصویر 3" },
            { src: "/assets/image/products/93.jpg", alt: "تصویر 4" }
        ],
        features: [
            { label: "جنس بدنه:", value: "تیتانیوم" },
            { label: "مقدار حافظه RAM:", value: "12 گیگابایت" },
            { label: "باتری", value: "لیتیوم 6000 میلی" }
        ],
        specifications: [
            { label: "پردازنده:", value: "AM32x new product" },
            { label: "فرکانس پردازنده:", value: "32HR" },
            { label: "وزن:", value: "230 گرم" },
            { label: "نسخه بلوتوث:", value: "7r" },
            { label: "نسخه وای فای:", value: "3prm new test" },
            { label: "سیستم عامل:", value: "IOS" },
            { label: "پردازنده گرافیکی:", value: "Hiliston 7200" },
            { label: "دوربین جلو:", value: "12 MP" },
            { label: "دوربین عقب:", value: "24MP" }
        ],
        colors: [
            { id: "1", name: "خاکستری", colorClass: "bg-gray-400" },
            { id: "2", name: "مشکی", colorClass: "bg-gray-900" },
            { id: "3", name: "آبی روشن", colorClass: "bg-blue-400" }
        ]
    },
    breadcrumbs = [
        { title: "خانه", href: "#" },
        { title: "محصولات", href: "#" },
        { title: "لپ تاپ ایسوس", href: "#", isActive: true }
    ],
    reviews = [
        {
            id: "1",
            title: "خوب بود ارزش خرید داره",
            date: "11 بهمن 1402",
            author: "امیررضا کریمی",
            isRecommended: true,
            content: "واقعا لپ تاپ عالی از هر نظر نسبت به قیمتش",
            isPurchaser: true
        },
        {
            id: "2",
            title: "تاچ پدش خراب بود، اجازه ی مرجوعی هم ندادن",
            date: "10 بهمن 1402",
            author: "امیررضا کریمی",
            isRecommended: false,
            content: "واقعا لپ تاپ عالی از هر نظر نسبت به قیمتش",
            isPurchaser: true
        }
    ],
    questions = [
        {
            id: "1",
            date: "11 بهمن 1402",
            author: "امیررضا کریمی",
            content: "سلام صفحه نمایش واقعا ipsهستش ممنون میشم راهنمایی کنید چقدر با tnفرق میکنه"
        }
    ]
}) => {
    const { id } = useParams<{ id: string }>()

    const productDetailsQuery = useFindProductByIdQuery(+id!, {
        query: {
            queryKey: getFindProductByIdQueryQueryKey(+id!),
            retry: 2,
            refetchOnWindowFocus: false
        }
    })

    const [selectedColorId, setSelectedColorId] = useState<string>("");
    const [activeTab, setActiveTab] = useState<TabType>('specifications');

    const handleColorSelect = (colorId: string) => {
        setSelectedColorId(colorId);
    };

    const handleAddToCart = () => {
        console.log('Adding to cart:', { productId: product.id, colorId: selectedColorId });
    };

    const handleSubmitReview = (reviewData: any) => {
        console.log('Submitting review:', reviewData);
    };

    const handleSubmitQuestion = (questionData: any) => {
        console.log('Submitting question:', questionData);
    };

    if (productDetailsQuery.isLoading) {
        return <p>Loading ...</p>
    }

    return (
        <main className="max-w-[1500px] mx-auto px-3 md:px-5 mt-9 ">
            <div className="my-8 lg:my-10 lg:px-5">
                <div className="bg-white shadow-box-sm rounded-xl py-5 px-2 sm:px-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <ProductGallery images={
                            productDetailsQuery?.data?.data?.images?.map(image => ({ alt: "", src: image }))
                            || []
                        }
                        />
                        <ProductInfo product={product} breadcrumbs={breadcrumbs} />

                        <div className="lg:w-3/12">
                            <ColorSelector
                                colors={product.colors}
                                selectedColorId={selectedColorId}
                                onColorSelect={handleColorSelect}
                            />
                            <PurchaseBox
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    </div>

                    <ServicesGrid />

                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {activeTab === 'specifications' && (
                        <SpecificationsTab specifications={product.specifications} />
                    )}

                    {activeTab === 'comments' && (
                        <CommentsTab
                            product={product}
                            reviews={reviews}
                            onSubmitReview={handleSubmitReview}
                        />
                    )}

                    {activeTab === 'questions' && (
                        <QuestionsTab
                            questions={questions}
                            onSubmitQuestion={handleSubmitQuestion}
                        />
                    )}
                </div>
            </div>
        </main>
    );
};

export default SingleProductPage;