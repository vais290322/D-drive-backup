// Mobile and Electronics Brand Constants

export const MOBILE_BRANDS = [
    // Top Global Brands
    'Samsung',
    'Apple',
    'Xiaomi',
    'Oppo',
    'Vivo',
    'Huawei',
    'OnePlus',
    'Realme',
    'Google',
    'Motorola',
    'Sony',
    'LG',
    'Nokia',
    'HTC',
    'ZTE',
    'Honor',
    'Asus',
    'Lenovo',
    'BlackBerry',
    'Nothing',
    'Amazon',
    'Acer',
    'Alcatel',
    'Meizu',
    'Ulefone',
    'OUKITEL',
    'Archos',
    'BLU',

    // Indian Brands
    'Micromax',
    'Karbonn',
    'Xolo',
    'Celkon',

    // Other Worldwide Brands
    'Coolpad',
    'Meitu',
    'TCL',
    '10.Or',
    'Condor',
    'Walton',
    'Others'
].sort();

export const LAPTOP_BRANDS = [
    'Dell',
    'HP',
    'Lenovo',
    'Asus',
    'Acer',
    'Apple',
    'MSI',
    'Samsung',
    'LG',
    'Microsoft',
    'Razer',
    'Alienware',
    'Huawei',
    'Others'
].sort();

export const TV_BRANDS = [
    'Samsung',
    'LG',
    'Sony',
    'Mi',
    'OnePlus',
    'TCL',
    'Hisense',
    'Panasonic',
    'Philips',
    'Toshiba',
    'VU',
    'Kodak',
    'Others'
].sort();

export const VEHICLE_BRANDS = [
    'Honda',
    'Yamaha',
    'Bajaj',
    'Hero',
    'TVS',
    'Royal Enfield',
    'KTM',
    'Suzuki',
    'Kawasaki',
    'Harley-Davidson',
    'Others'
].sort();

// Helper function to get brands by category
export const getBrandsByCategory = (category: string): string[] => {
    const categoryLower = category?.toLowerCase();

    switch (categoryLower) {
        case 'mobile':
            return MOBILE_BRANDS;
        case 'laptop':
            return LAPTOP_BRANDS;
        case 'tv':
            return TV_BRANDS;
        case 'vehicle':
            return VEHICLE_BRANDS;
        default:
            return [];
    }
};
