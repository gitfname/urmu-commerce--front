import React, { useState, useEffect, useMemo } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useFindManyStoriesQuery, getFindManyStoriesQueryQueryKey } from '../../services/api/ecommerce--api';
import { Env } from '../../env';

interface StoryImage {
    id: string;
    image: string;
    description?: string;
    isVideo?: boolean;
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
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const isSm = useMediaQuery("only screen and (max-width : 640px)");

    // Fetch stories from API
    const storiesQuery = useFindManyStoriesQuery(
        { limit: 20, skip: 0 },
        {
            query: {
                queryKey: getFindManyStoriesQueryQueryKey({ limit: 20, skip: 0 }),
                retry: 2,
                refetchOnWindowFocus: false
            }
        }
    );

    // Transform API data to component format
    const apiStories: StoryItem[] = useMemo(() => 
        storiesQuery?.data?.data?.data?.map((story) => ({
            id: story.id.toString(),
            image: Env.stories + story.thumbnailImage,
            title: story.title,
            description: story.title,
            isActive: true,
            images: story.videos.map((video, index) => ({
                id: `${story.id}-${index}`,
                image: Env.storiesVideos + video,
                description: story.title,
                isVideo: true
            }))
        })) || [], [storiesQuery?.data?.data?.data]
    );

    const [displayStories, setDisplayStories] = useState<StoryItem[]>([]);

    // Update displayStories when API data changes
    useEffect(() => {
        if (apiStories.length > 0) {
            setDisplayStories(apiStories);
        } else if (stories.length > 0) {
            setDisplayStories(stories);
        }
    }, [apiStories, stories]);

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
        setIsVideoPlaying(false);
        setVideoCompleted(false);
    };

    const handleSlideChange = (swiper: { activeIndex: number }) => {
        setCurrentImageIndex(swiper.activeIndex);
        setProgress(0);
        setIsVideoPlaying(false);
        setVideoCompleted(false);
    };

    const handleVideoEnded = () => {
        setVideoCompleted(true);
        setIsVideoPlaying(false);
        // Close modal after video ends
        setTimeout(() => {
            closeModal();
        }, 500);
    };

    const handleVideoPlay = () => {
        setIsVideoPlaying(true);
    };

    // Progress bar effect with auto-close (only for images, not videos)
    useEffect(() => {
        if (isModalOpen && selectedStory && !isVideoPlaying) {
            const currentImage = selectedStory.images && selectedStory.images.length > 0 
                ? selectedStory.images[currentImageIndex] 
                : null;
            
            // Skip progress bar for videos
            if (currentImage?.isVideo) {
                return;
            }

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
    }, [isModalOpen, selectedStory, currentImageIndex, isVideoPlaying]);

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

    // Show loading state
    if (storiesQuery.isLoading) {
        return (
            <section className="bg-white py-4 px-3 xl:px-5 border-b border-gray-100">
                <div className="max-w-[1500px] mx-auto">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 min-w-[80px]">
                                <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                                <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Show empty state if no stories
    if (displayStories.length === 0) {
        return null;
    }

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
                                    : [{ id: 'default', image: selectedStory.image, description: selectedStory.description, isVideo: false }]
                                ).map((image, index) => {
                                    const isCurrentVideo = index === currentImageIndex && image.isVideo;
                                    const isVideoCompleted = isCurrentVideo && videoCompleted;
                                    
                                    return (
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
                                                    width: isCurrentVideo 
                                                        ? (isVideoCompleted ? '100%' : '0%')
                                                        : index === currentImageIndex 
                                                            ? `${progress}%` 
                                                            : index < currentImageIndex 
                                                                ? '100%' 
                                                                : '0%'
                                                }}
                                            />
                                        </div>
                                    );
                                })}
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
                                        : [{ id: 'default', image: selectedStory.image, description: selectedStory.description, isVideo: false }]
                                    ).map((image) => (
                                        <SwiperSlide key={image.id} className="story-swiper-slide">
                                            <div className="relative h-full flex items-center justify-center p-4">
                                                {image.isVideo ? (
                                                    <video
                                                        src={image.image}
                                                        className={`w-full object-cover rounded-lg ${
                                                            isSm ? 'h-64' : 'h-64'
                                                        }`}
                                                        autoPlay
                                                        muted
                                                        playsInline
                                                        onEnded={handleVideoEnded}
                                                        onPlay={handleVideoPlay}
                                                        onError={(e) => {
                                                            console.error('Video failed to load:', e);
                                                        }}
                                                    />
                                                ) : (
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
                                                )}
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
