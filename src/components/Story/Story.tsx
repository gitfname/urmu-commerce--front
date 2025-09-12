import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

interface StoryImage {
    id: string;
    image: string;
    description?: string;
}

interface StoryItem {
    id: string;
    image: string; // Main thumbnail image
    title: string;
    description?: string;
    isActive?: boolean;
    images?: StoryImage[]; // Multiple images for the story
}

interface StoryProps {
    stories?: StoryItem[];
}

const Story: React.FC<StoryProps> = ({ stories = [] }) => {
    const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const isSm = useMediaQuery("only screen and (max-width : 640px)");

    // Default stories if none provided
    const defaultStories: StoryItem[] = [
        {
            id: '1',
            image: '/assets/image/products/1.webp',
            title: 'محصولات جدید',
            description: 'جدیدترین محصولات ما را مشاهده کنید',
            isActive: true,
            images: [
                {
                    id: '1-1',
                    image: '/assets/image/products/1.webp',
                    description: 'لپ تاپ جدید با طراحی مدرن'
                },
                {
                    id: '1-2',
                    image: '/assets/image/products/2.webp',
                    description: 'کیفیت بالا و قیمت مناسب'
                },
                {
                    id: '1-3',
                    image: '/assets/image/products/3.webp',
                    description: 'ارسال رایگان در سراسر کشور'
                }
            ]
        },
        {
            id: '2',
            image: '/assets/image/products/2.webp',
            title: 'تخفیف ویژه',
            description: 'تا 50% تخفیف روی محصولات منتخب',
            isActive: true,
            images: [
                {
                    id: '2-1',
                    image: '/assets/image/products/2.webp',
                    description: 'تخفیف 50% روی تمام محصولات'
                },
                {
                    id: '2-2',
                    image: '/assets/image/products/4.webp',
                    description: 'فقط تا پایان هفته'
                }
            ]
        },
        {
            id: '3',
            image: '/assets/image/products/3.webp',
            title: 'پیشنهاد روز',
            description: 'پیشنهادات ویژه امروز را از دست ندهید',
            isActive: false,
            images: [
                {
                    id: '3-1',
                    image: '/assets/image/products/3.webp',
                    description: 'پیشنهادات ویژه روزانه'
                },
                {
                    id: '3-2',
                    image: '/assets/image/products/5.webp',
                    description: 'محصولات با کیفیت بالا'
                },
                {
                    id: '3-3',
                    image: '/assets/image/products/6.webp',
                    description: 'خدمات پس از فروش عالی'
                }
            ]
        },
        {
            id: '4',
            image: '/assets/image/products/4.webp',
            title: 'محصولات محبوب',
            description: 'محبوب‌ترین محصولات مشتریان',
            isActive: true,
            images: [
                {
                    id: '4-1',
                    image: '/assets/image/products/4.webp',
                    description: 'محبوب‌ترین محصولات'
                }
            ]
        },
        {
            id: '5',
            image: '/assets/image/products/5.webp',
            title: 'فروش ویژه',
            description: 'فروش ویژه آخر هفته',
            isActive: false,
            images: [
                {
                    id: '5-1',
                    image: '/assets/image/products/5.webp',
                    description: 'فروش ویژه آخر هفته'
                },
                {
                    id: '5-2',
                    image: '/assets/image/products/1.webp',
                    description: 'تخفیف‌های باورنکردنی'
                }
            ]
        },
        {
            id: '6',
            image: '/assets/image/products/6.webp',
            title: 'محصولات دیجیتال',
            description: 'بهترین محصولات دیجیتال',
            isActive: true,
            images: [
                {
                    id: '6-1',
                    image: '/assets/image/products/6.webp',
                    description: 'بهترین محصولات دیجیتال'
                },
                {
                    id: '6-2',
                    image: '/assets/image/products/2.webp',
                    description: 'تکنولوژی روز دنیا'
                },
                {
                    id: '6-3',
                    image: '/assets/image/products/3.webp',
                    description: 'کیفیت تضمین شده'
                }
            ]
        }
    ];

    const [displayStories, setDisplayStories] = useState<StoryItem[]>(
        stories.length > 0 ? stories : defaultStories
    );

    const handleStoryClick = (story: StoryItem) => {
        // Update the story object to mark it as inactive (viewed)
        const updatedStory = { ...story, isActive: false };
        
        // Update the display stories to reflect the change
        setDisplayStories(prev => 
            prev.map(s => s.id === story.id ? updatedStory : s)
        );
        
        setSelectedStory(updatedStory);
        setCurrentImageIndex(0);
        setProgress(0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedStory(null);
        setCurrentImageIndex(0);
        setProgress(0);
    };

    const handleSlideChange = (swiper: { activeIndex: number }) => {
        setCurrentImageIndex(swiper.activeIndex);
        setProgress(0);
    };

    // Progress bar effect with auto-close
    useEffect(() => {
        if (isModalOpen && selectedStory) {
            const totalImages = selectedStory.images && selectedStory.images.length > 0 
                ? selectedStory.images.length 
                : 1;

            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        // If this is the last image, close the modal
                        if (currentImageIndex === totalImages - 1) {
                            setTimeout(() => {
                                closeModal();
                            }, 500); // Small delay before closing
                            return 100;
                        }
                        return 0;
                    }
                    return prev + 1;
                });
            }, 30); // 3 seconds total (3000ms / 100 = 30ms per step)

            return () => clearInterval(interval);
        }
    }, [isModalOpen, selectedStory, currentImageIndex]);

    const swiperConfig = {
        modules: [Navigation, Pagination, Autoplay],
        navigation: {
            nextEl: '.story-swiper-button-next',
            prevEl: '.story-swiper-button-prev',
        },
        pagination: {
            el: '.story-swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        loop: false,
        speed: 500,
        onSlideChange: handleSlideChange,
    };

    return (
        <>
            <section className="bg-white py-4 px-3 xl:px-5 border-b border-gray-100">
                <div className="max-w-[1500px] mx-auto">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                        {displayStories.map((story) => (
                            <div
                                key={story.id}
                                className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group"
                                onClick={() => handleStoryClick(story)}
                            >
                                <div className={`relative w-16 h-16 rounded-full p-0.5 transition-all duration-300 group-hover:scale-110 ${
                                    story.isActive 
                                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500' 
                                        : 'bg-gray-200'
                                }`}>
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                                        <img
                                            src={story.image}
                                            alt={story.title}
                                            className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/assets/image/products/1.webp';
                                            }}
                                        />
                                    </div>
                                </div>
                                <span className="text-xs text-gray-700 text-center leading-tight max-w-[80px] truncate group-hover:text-blue-600 transition-colors">
                                    {story.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Modal */}
            {isModalOpen && selectedStory && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-95 z-50 flex items-center justify-center p-2">
                    <div className={`bg-white lg:rounded-3xl overflow-hidden shadow-2xl ${
                        isSm ? 'w-full h-full' : 'w-[90vw] max-w-4xl h-[90vh]'
                    }`}>
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 right-0 z-20">
                            <div className="flex gap-1 p-3">
                                {(selectedStory.images && selectedStory.images.length > 0 
                                    ? selectedStory.images 
                                    : [{ id: 'default', image: selectedStory.image, description: selectedStory.description }]
                                ).map((_, index) => (
                                    <div key={index} className="flex-1 bg-gray-300 rounded-full h-1 overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-300 ease-out ${
                                                index === currentImageIndex 
                                                    ? 'bg-white' 
                                                    : index < currentImageIndex 
                                                        ? 'bg-white' 
                                                        : 'bg-transparent'
                                            }`}
                                            style={{
                                                width: index === currentImageIndex ? `${progress}%` : 
                                                       index < currentImageIndex ? '100%' : '0%'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between p-4 pt-16 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                    <img
                                        src={selectedStory.image}
                                        alt={selectedStory.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = '/assets/image/products/1.webp';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {selectedStory.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {currentImageIndex + 1} از {(selectedStory.images && selectedStory.images.length > 0 
                                            ? selectedStory.images.length 
                                            : 1)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Image Slider */}
                        <div className="relative flex-1 flex flex-col lg:h-[60vh] h-[50vh]">
                            <div className="flex-1 relative">
                                <Swiper {...swiperConfig} className="story-swiper h-full">
                                    {(selectedStory.images && selectedStory.images.length > 0 
                                        ? selectedStory.images 
                                        : [{ id: 'default', image: selectedStory.image, description: selectedStory.description }]
                                    ).map((image) => (
                                        <SwiperSlide key={image.id} className="story-swiper-slide">
                                            <div className="relative h-full flex items-center justify-center p-4">
                                                <img
                                                    src={image.image}
                                                    alt={image.description || selectedStory.title}
                                                    className={`w-full object-cover rounded-lg ${
                                                        isSm ? 'h-64' : 'h-64'
                                                    }`}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/assets/image/products/1.webp';
                                                    }}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                    
                                   
                                    
                                    {/* Pagination */}
                                    <div className="story-swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2"></div>
                                </Swiper>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 bg-gradient-to-t from-white to-gray-50 min-h-0">
                            <h4 className="text-lg font-bold text-gray-800 mb-2">
                                {selectedStory.title}
                            </h4>
                            {selectedStory.images && selectedStory.images.length > 0 && selectedStory.images[currentImageIndex]?.description && (
                                <p className="text-gray-600 leading-relaxed mb-3 text-sm">
                                    {selectedStory.images[currentImageIndex].description}
                                </p>
                            )}
                            {(!selectedStory.images || selectedStory.images.length === 0) && selectedStory.description && (
                                <p className="text-gray-600 leading-relaxed mb-3 text-sm">
                                    {selectedStory.description}
                                </p>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-3">
                                <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm">
                                    مشاهده محصولات
                                </button>
                                <button className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2.5 px-4 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm">
                                    اشتراک‌گذاری
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Story;
