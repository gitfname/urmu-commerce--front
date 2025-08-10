import SuggestedView from "./SuggestedView/SuggestedView"

function SuggestedProducts() {
    return (
        <SuggestedView
            categories={[
                {
                    id: '1',
                    title: 'هدفون، هدست و هندزفری',
                    subtitle: 'بر اساس بازدیدهای شما',
                    viewAllHref: '#',
                    products: [
                        { id: '1-1', image: 'assets/image/suggested/1.webp', href: '#' },
                        { id: '1-2', image: 'assets/image/suggested/2.webp', href: '#' },
                        { id: '1-3', image: 'assets/image/suggested/3.webp', href: '#' },
                        { id: '1-4', image: 'assets/image/suggested/4.webp', href: '#' }
                    ]
                },
                {
                    id: '2',
                    title: 'گوشی موبایل',
                    subtitle: 'بر اساس بازدیدهای شما',
                    viewAllHref: '#',
                    products: [
                        { id: '2-1', image: 'assets/image/suggested/5.webp', href: '#' },
                        { id: '2-2', image: 'assets/image/suggested/6.webp', href: '#' },
                        { id: '2-3', image: 'assets/image/suggested/7.webp', href: '#' },
                        { id: '2-4', image: 'assets/image/suggested/8.webp', href: '#' }
                    ]
                },
                {
                    id: '3',
                    title: 'لپ تاپ و مک بوک',
                    subtitle: 'بر اساس بازدیدهای شما',
                    viewAllHref: '#',
                    products: [
                        { id: '3-1', image: 'assets/image/suggested/9.webp', href: '#' },
                        { id: '3-2', image: 'assets/image/suggested/10.webp', href: '#' },
                        { id: '3-3', image: 'assets/image/suggested/11.webp', href: '#' },
                        { id: '3-4', image: 'assets/image/suggested/12.webp', href: '#' }
                    ]
                },
                {
                    id: '4',
                    title: 'ساعت هوشمند',
                    subtitle: 'بر اساس بازدیدهای شما',
                    viewAllHref: '#',
                    products: [
                        { id: '4-1', image: 'assets/image/suggested/13.webp', href: '#' },
                        { id: '4-2', image: 'assets/image/suggested/14.webp', href: '#' },
                        { id: '4-3', image: 'assets/image/suggested/15.webp', href: '#' },
                        { id: '4-4', image: 'assets/image/suggested/16.webp', href: '#' }
                    ]
                }
            ]}
        />
    )
}

export default SuggestedProducts