// Sample data for component development and testing

export const SAMPLE_TIMELINE_DATA = {
  timeline: [
    { status: 'Order Placed', completed: true, date: '12 Dec, 2025' },
    { status: 'On The Way', completed: true, active: true, date: '14 Dec, 2025' },
    { status: 'Out For Delivery', completed: false, date: '17 Dec, 2025' },
    { status: 'Delivered', completed: false }
  ],
  deliveryPartner: 'Pickup Up Your Courier. Will Be Delivered Soon.'
};

export const SAMPLE_ORDER_DATA = {
  id: '964368966',
  trackingId: 'EKFC9469943995',
  courierName: 'EKART',
  productName: 'Pharmeasy Fish Oil 1000mg Soft Gelatin 60 Capsules',
  price: 1500,
  originalPrice: 1800,
  quantity: 1,
  image: '/src/assets/images/medicine.jpeg',
  status: 'On the Way',
  statusBg: '#10B981',
  expectedDelivery: '18th Dec, 2025',
  customerName: 'Gourav Gupta',
  phone: '9999999999',
  address: 'A/B, Section Lane, Odisha, Noida, 744115'
};

export const SAMPLE_ORDERS_LIST = [
  {
    id: 1,
    productName: 'Pharmeasy Fish Oil 1000mg',
    customerName: 'Gourav Gupta',
    phone: '9999999999',
    address: 'A/B, Section Lane, Odisha, Noida, 744115',
    status: 'On The Way',
    statusBg: '#10B981',
    expectedDelivery: '18th Dec, 2025',
    image: '/src/assets/images/medicine.jpeg'
  },
  {
    id: 2,
    productName: 'Paracetamol 500mg (20 tablets)',
    customerName: 'John Doe',
    phone: '8888888888',
    address: 'XYZ Street, Mumbai, Maharashtra, 400001',
    status: 'Delivered',
    statusBg: '#10B981',
    deliveredDate: '15th Dec, 2025',
    image: '/src/assets/images/medicine.jpeg'
  },
  {
    id: 3,
    productName: 'Vitamin D3 2000IU (60 capsules)',
    customerName: 'Jane Smith',
    phone: '7777777777',
    address: '123 Main St, Delhi, 110001',
    status: 'Order Placed',
    statusBg: '#F97316',
    expectedDelivery: '20th Dec, 2025',
    image: '/src/assets/images/medicine.jpeg'
  }
];
