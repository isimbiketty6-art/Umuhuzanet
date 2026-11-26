import { AgriProduct, AgriJob, AgriOrder, WholesaleRequest } from '../types/agri';
import { AGRI_ASSETS } from './assets';

export const RWANDA_DISTRICTS = [
  'Gasabo (Kigali)',
  'Kicukiro (Kigali)',
  'Nyarugenge (Kigali)',
  'Musanze (Northern)',
  'Gicumbi (Northern)',
  'Rulindo (Northern)',
  'Burera (Northern)',
  'Gakenke (Northern)',
  'Huye (Southern)',
  'Muhanga (Southern)',
  'Kamonyi (Southern)',
  'Nyanza (Southern)',
  'Ruhango (Southern)',
  'Nyamagabe (Southern)',
  'Rubavu (Western)',
  'Rusizi (Western)',
  'Karongi (Western)',
  'Rutsiro (Western)',
  'Nyabihu (Western)',
  'Nyagatare (Eastern)',
  'Kayonza (Eastern)',
  'Bugesera (Eastern)',
  'Rwamagana (Eastern)',
  'Gatsibo (Eastern)',
  'Kirehe (Eastern)',
  'Ngoma (Eastern)'
];

export const INITIAL_AGRI_PRODUCTS: AgriProduct[] = [
  {
    id: 'prod-01',
    name: 'Fresh Tomatoes',
    nameRw: 'Inyanya Zishya',
    category: 'Vegetables',
    pricePerUnit: 800,
    unit: 'kg',
    location: 'Kigali',
    district: 'Gasabo',
    province: 'Kigali',
    sellerId: 's-01',
    sellerName: 'Jean Claude Nshimiyimana',
    sellerPhone: '+250 788 412 901',
    sellerRating: 4.9,
    sellerVerified: true,
    stockQuantity: 450,
    image: AGRI_ASSETS.freshTomatoes,
    description: 'Juicy, sun-ripened red tomatoes harvested daily from greenhouse irrigation in Gasabo. Ideal for home cooking, salads, and restaurant catering.',
    descriptionRw: 'Inyanya zitukura, zishya zasaruwe mu buhinzi bwa kijyambere muri Gasabo. Ziraryoshye cyane kandi zirakomeye.',
    harvestDate: 'Today morning',
    isOrganic: true
  },
  {
    id: 'prod-02',
    name: 'Irish Potatoes',
    nameRw: 'Ibirayi by’i Musanze (Kinigi)',
    category: 'Vegetables',
    pricePerUnit: 500,
    unit: 'kg',
    location: 'Musanze',
    district: 'Musanze',
    province: 'Northern',
    sellerId: 's-02',
    sellerName: 'Aline Mukamana (Musanze Farmers Coop)',
    sellerPhone: '+250 783 119 440',
    sellerRating: 5.0,
    sellerVerified: true,
    stockQuantity: 2800,
    image: AGRI_ASSETS.irishPotatoes,
    description: 'Famous volcanic soil Kinigi Irish potatoes. Firm texture, superior taste, and ideal for chips, boiling, or long-term food storage.',
    descriptionRw: 'Ibirayi byiza by\'ibirunga byo mu bwoko bwa Kinigi, bishya kandi byuzuye ifu. Byiza cyane ku mafiriti no guteka.',
    harvestDate: '2 days ago',
    isOrganic: true,
    isBulkWholesale: true
  },
  {
    id: 'prod-03',
    name: 'Sweet Bananas',
    nameRw: 'Imitoki n’Imineke y’i Rubavu',
    category: 'Fruits',
    pricePerUnit: 700,
    unit: 'kg',
    location: 'Rubavu',
    district: 'Rubavu',
    province: 'Western',
    sellerId: 's-03',
    sellerName: 'Pascal Habimana',
    sellerPhone: '+250 785 802 331',
    sellerRating: 4.8,
    sellerVerified: true,
    stockQuantity: 650,
    image: AGRI_ASSETS.sweetBananas,
    description: 'Freshly cut sweet yellow dessert bananas and cooking plantains sourced directly from lush hillside plantations near Lake Kivu.',
    descriptionRw: 'Imineke n\'igitoki byoroshye kandi biryohera biturutse ku nkengero z\'Ikiyaga cya Kivu mu Karere ka Rubavu.',
    harvestDate: 'Yesterday',
    isOrganic: true
  },
  {
    id: 'prod-04',
    name: 'Fresh Milk',
    nameRw: 'Amata Meza y’Inka',
    category: 'Dairy Products',
    pricePerUnit: 1000,
    unit: 'liter',
    location: 'Huye',
    district: 'Huye',
    province: 'Southern',
    sellerId: 's-04',
    sellerName: 'Koperative Amizero y’Aborozi',
    sellerPhone: '+250 788 650 120',
    sellerRating: 4.9,
    sellerVerified: true,
    stockQuantity: 300,
    image: AGRI_ASSETS.freshMilk,
    description: '100% pure raw and chilled whole cow milk tested for quality. Directly from veterinary-monitored dairy herds in Huye district.',
    descriptionRw: 'Amata y\'inka y\'umwimerere, yisukuye kandi apimwe neza biturutse mu mworozi w\'intangarugero muri Huye.',
    harvestDate: 'Fresh today'
  },
  {
    id: 'prod-05',
    name: 'Red Beans',
    nameRw: 'Ibiharage Bitukura bya Gicumbi',
    category: 'Grains & Cereals',
    pricePerUnit: 1200,
    unit: 'kg',
    location: 'Gicumbi',
    district: 'Gicumbi',
    province: 'Northern',
    sellerId: 's-05',
    sellerName: 'Gicumbi Grain Collective',
    sellerPhone: '+250 788 903 218',
    sellerRating: 4.9,
    sellerVerified: true,
    stockQuantity: 5200,
    image: AGRI_ASSETS.redBeans,
    description: 'Clean, sorted dry red kidney beans. High protein content, fast cooking time, zero stones, bagged in 25kg or 50kg sacks.',
    descriptionRw: 'Ibiharage bitukura byatoranyijwe neza, bidafite amabuye cyangwa imyanda. Bitogota vuba kandi byuzuye intungamubiri.',
    harvestDate: 'Recent harvest',
    isBulkWholesale: true
  },
  {
    id: 'prod-06',
    name: 'Avocados',
    nameRw: 'Avoka Ziryoshye zo mu Burasirazuba',
    category: 'Fruits',
    pricePerUnit: 600,
    unit: 'kg',
    location: 'Nyagatare',
    district: 'Nyagatare',
    province: 'Eastern',
    sellerId: 's-06',
    sellerName: 'Emmanuel Rutaganda',
    sellerPhone: '+250 782 554 990',
    sellerRating: 4.7,
    sellerVerified: true,
    stockQuantity: 820,
    image: AGRI_ASSETS.avocados,
    description: 'Rich and creamy avocados grown in Eastern sunshine. Loaded with healthy fats, perfectly ready for family meals and export.',
    descriptionRw: 'Avoka zifite amavuta menshi kandi ziryoshye, zereye ku zuba ryo mu Burasirazuba bwa Nyagatare.',
    harvestDate: '3 days ago'
  }
];

export const INITIAL_AGRI_JOBS: AgriJob[] = [
  {
    id: 'job-01',
    title: 'Farm Assistant',
    titleRw: 'Umuhinzi w’Umunyamwuga / Umwungiriza',
    farmOrCompany: 'Nyagatare Modern Agrifarm',
    location: 'Nyagatare',
    district: 'Nyagatare',
    employmentType: 'Full-time',
    salaryRwf: 'RWF 250,000 – 350,000 / mo',
    postedDate: '1 day ago',
    description: 'Oversee daily field irrigation, crop scouting for pests, and harvest sorting on a 15-hectare horticulture facility in Nyagatare.',
    descriptionRw: 'Gukurikirana imirimo yo kuhira, gutera imiti n\'ifumbire no gukusanya umusaruro mu murima mugari w\'i Nyagatare.',
    requirements: [
      'Diploma in Agriculture, Crop Production, or 2+ years field experience',
      'Knowledge of drip irrigation maintenance and pest control',
      'Fluency in Kinyarwanda; basic English is an asset'
    ],
    applicantCount: 8,
    category: 'Farm Production'
  },
  {
    id: 'job-02',
    title: 'Agriculture Sales Agent',
    titleRw: 'Umuhuzabikorwa w’Ibicuruzwa by’Ubuhinzi',
    farmOrCompany: 'Rwanda Fresh Harvest Logistics',
    location: 'Kigali',
    district: 'Gasabo',
    employmentType: 'Part-time',
    salaryRwf: 'RWF 180,000 – 300,000 / mo + Commission',
    postedDate: '2 days ago',
    description: 'Connect farmer produce arriving from the Northern Province with hotels, supermarkets, and restaurants across Kigali City.',
    descriptionRw: 'Guhuza umusaruro w\'abahinzi n\'amahoteli, amarestora n\'amasoko manini yo mu Mujyi wa Kigali.',
    requirements: [
      'Strong negotiation skills and local market knowledge in Kigali',
      'Active smartphone for managing orders on Umuhuza Connect',
      'Punctual and customer-oriented'
    ],
    applicantCount: 14,
    category: 'Sales & Distribution'
  },
  {
    id: 'job-03',
    title: 'Farm Manager',
    titleRw: 'Umuyobozi w’Umurima na Serire (Greenhouse)',
    farmOrCompany: 'Volcano Green Enterprises Ltd',
    location: 'Musanze',
    district: 'Musanze',
    employmentType: 'Full-time',
    salaryRwf: 'RWF 450,000 – 700,000 / mo',
    postedDate: '3 days ago',
    description: 'Manage staff, agricultural input inventories, soil health regimes, and post-harvest packaging for commercial Irish potato and tomato crops.',
    descriptionRw: 'Kuyobora abakozi b\'umurima, gukurikirana ifumbire, ubuziranenge bw\'ibirayi n\'inyanya zoherezwa mu mahanga.',
    requirements: [
      'BSc in Agronomy, Agribusiness, or related discipline',
      'Proven leadership experience managing 10+ agricultural field workers',
      'Good reporting and inventory management skills'
    ],
    applicantCount: 6,
    category: 'Agronomy'
  }
];

export const INITIAL_ORDERS: AgriOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'UMH-01001',
    customerId: 'cust-01',
    customerName: 'Jean Claude',
    customerPhone: '+250 788 501 229',
    deliveryDistrict: 'Gasabo (Kigali)',
    deliveryAddress: 'KG 11 Ave, Kimironko',
    paymentMethod: 'MTN Mobile Money (MoMo)',
    items: [
      { productId: 'prod-01', productName: 'Fresh Tomatoes', quantity: 20, unitPrice: 800, unit: 'kg', subtotal: 16000 }
    ],
    totalAmount: 16000,
    status: 'Pending',
    createdAt: 'Today, 08:30 AM',
    sellerName: 'Jean Claude Nshimiyimana'
  },
  {
    id: 'ord-1002',
    orderNumber: 'UMH-01002',
    customerId: 'cust-02',
    customerName: 'Aline',
    customerPhone: '+250 783 710 882',
    deliveryDistrict: 'Musanze (Northern)',
    deliveryAddress: 'Ruhengeri Town Market',
    paymentMethod: 'MTN Mobile Money (MoMo)',
    items: [
      { productId: 'prod-02', productName: 'Irish Potatoes', quantity: 50, unitPrice: 500, unit: 'kg', subtotal: 25000 }
    ],
    totalAmount: 25000,
    status: 'Processing',
    createdAt: 'Yesterday, 14:15 PM',
    sellerName: 'Musanze Farmers Coop'
  },
  {
    id: 'ord-1003',
    orderNumber: 'UMH-01003',
    customerId: 'cust-03',
    customerName: 'Pascal',
    customerPhone: '+250 785 991 334',
    deliveryDistrict: 'Rubavu (Western)',
    deliveryAddress: 'Gisenyi Border Road',
    paymentMethod: 'Airtel Money',
    items: [
      { productId: 'prod-03', productName: 'Sweet Bananas', quantity: 30, unitPrice: 700, unit: 'kg', subtotal: 21000 }
    ],
    totalAmount: 21000,
    status: 'Delivered',
    createdAt: '2 days ago',
    sellerName: 'Pascal Habimana'
  }
];

export const INITIAL_WHOLESALE_REQUESTS: WholesaleRequest[] = [
  {
    id: 'req-01',
    traderName: 'Kigali Supermarkets Supply Ltd',
    companyName: 'Kigali Food Distributors',
    cropRequired: 'Fresh Tomatoes (Grade A)',
    quantityNeeded: '2,500 kg / week',
    targetPricePerKg: 700,
    deliveryLocation: 'Nyabugogo Central Depot, Kigali',
    deadline: 'Next Monday',
    status: 'Open for Farmers',
    responsesCount: 4
  },
  {
    id: 'req-02',
    traderName: 'Inyange Agro-Processors Partner',
    companyName: 'Musanze Starch Works',
    cropRequired: 'Irish Potatoes (Kinigi variety)',
    quantityNeeded: '10 Tonnes',
    targetPricePerKg: 460,
    deliveryLocation: 'Musanze Industrial Park',
    deadline: 'In 5 days',
    status: 'Negotiating',
    responsesCount: 7
  }
];
