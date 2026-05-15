// ─────────────────────────────────────────────────────────────────
//  src/data/mockData.js
//  All mock data. Replace with real API calls in production.
// ─────────────────────────────────────────────────────────────────

export const analyticsStats = [
  { label: 'Total Projects', value: '52',   change: '+8',   up: true },
  { label: 'Active Clients', value: '24',   change: '+3',   up: true },
  { label: 'Messages',       value: '18',   change: '+12',  up: true },
  { label: 'Revenue (UGX)',  value: '4.2M', change: '+22%', up: true },
];

export const monthlyRevenue = [
  { month: 'Jan', revenue: 800000,  projects: 4  },
  { month: 'Feb', revenue: 1200000, projects: 6  },
  { month: 'Mar', revenue: 950000,  projects: 5  },
  { month: 'Apr', revenue: 1800000, projects: 9  },
  { month: 'May', revenue: 1400000, projects: 7  },
  { month: 'Jun', revenue: 2100000, projects: 11 },
  { month: 'Jul', revenue: 1700000, projects: 8  },
  { month: 'Aug', revenue: 2400000, projects: 12 },
];

export const serviceBreakdown = [
  { name: 'Web Dev',  pct: 42, color: '#3B82F6' },
  { name: 'App Dev',  pct: 28, color: '#8B5CF6' },
  { name: 'Design',   pct: 20, color: '#F59E0B' },
  { name: 'Branding', pct: 10, color: '#10B981' },
];

export const portfolioItems = [
  { id: 1, name: 'Celutamax Motors',    category: 'Website',  status: 'Live',        client: 'Charles M.', date: '2026-01-15', emoji: '🚗', color: '#3B82F6' },
  { id: 2, name: 'Brand Identity Pack', category: 'Graphics', status: 'Live',        client: 'Amara K.',   date: '2026-02-03', emoji: '🎨', color: '#F59E0B' },
  { id: 3, name: 'DeliveryGo App',      category: 'App',      status: 'Live',        client: 'James O.',   date: '2026-02-20', emoji: '📱', color: '#10B981' },
  { id: 4, name: 'ShopEase E-Commerce', category: 'Website',  status: 'Live',        client: 'Rita N.',    date: '2026-03-08', emoji: '🛒', color: '#8B5CF6' },
  { id: 5, name: 'Social Campaign 30',  category: 'Graphics', status: 'Live',        client: 'Bistro UG',  date: '2026-03-22', emoji: '📢', color: '#EC4899' },
  { id: 6, name: 'BizTrack Dashboard',  category: 'App',      status: 'In Progress', client: 'David W.',   date: '2026-04-11', emoji: '💼', color: '#14B8A6' },
  { id: 7, name: 'LuxeStay Hotel Site', category: 'Website',  status: 'In Progress', client: 'Grace T.',   date: '2026-05-01', emoji: '🏨', color: '#F59E0B' },
  { id: 8, name: 'FreshMart Branding',  category: 'Branding', status: 'Draft',       client: 'Moses K.',   date: '2026-05-07', emoji: '🥬', color: '#10B981' },
];

export const servicesData = [
  { id: 1,  name: 'Basic Website (5 pages)',   category: 'Web',    priceMin: 300000,  priceMax: 600000,  active: true  },
  { id: 2,  name: 'Business Website (Custom)', category: 'Web',    priceMin: 600000,  priceMax: 1200000, active: true  },
  { id: 3,  name: 'E-Commerce Website',        category: 'Web',    priceMin: 1200000, priceMax: 2500000, active: true  },
  { id: 4,  name: 'SEO Setup',                 category: 'Web',    priceMin: 200000,  priceMax: 500000,  active: true  },
  { id: 5,  name: 'Android App Development',   category: 'App',    priceMin: 800000,  priceMax: 3000000, active: true  },
  { id: 6,  name: 'iOS App Development',       category: 'App',    priceMin: 1500000, priceMax: 4000000, active: true  },
  { id: 7,  name: 'Cross-Platform Apps',       category: 'App',    priceMin: 1000000, priceMax: 5000000, active: true  },
  { id: 8,  name: 'Logo Design',               category: 'Design', priceMin: 150000,  priceMax: 300000,  active: true  },
  { id: 9,  name: 'Social Media Graphics',     category: 'Design', priceMin: 80000,   priceMax: 200000,  active: true  },
  { id: 10, name: 'Flyers & Posters',          category: 'Design', priceMin: 20000,   priceMax: 25000,   active: false },
  { id: 11, name: 'Business Cards',            category: 'Design', priceMin: 10000,   priceMax: 15000,   active: true  },
  { id: 12, name: 'Monthly Maintenance',       category: 'Web',    priceMin: 50000,   priceMax: 150000,  active: true  },
];

export const testimonialsData = [
  { id: 1, name: 'Charles M.', business: 'Celutamax Motors',   rating: 5, approved: true,  date: '2026-01-20', text: 'CodeCanvas built our dealership website and the result was absolutely stunning. Our online leads have increased dramatically since launch.' },
  { id: 2, name: 'Amara K.',   business: 'StartupHub Kampala', rating: 5, approved: true,  date: '2026-02-10', text: 'Professional, creative, and fast delivery. Elijah designed our entire brand identity and the quality exceeded every expectation we had.' },
  { id: 3, name: 'James O.',   business: 'DeliveryGo Uganda',  rating: 5, approved: true,  date: '2026-02-25', text: 'Our mobile app was delivered on time and works flawlessly. CodeCanvas understood our vision perfectly and turned it into reality.' },
  { id: 4, name: 'Rita N.',    business: 'ShopEase UG',        rating: 5, approved: false, date: '2026-04-02', text: 'The e-commerce site they built for us is beautiful and very easy to manage. Sales have improved significantly since launch.' },
  { id: 5, name: 'David W.',   business: 'BizTrack Ltd',       rating: 4, approved: false, date: '2026-05-05', text: 'Great team to work with. Very responsive and the dashboard design is exactly what we needed for our business operations.' },
];

export const messagesData = [
  { id: 1, name: 'Sarah Nakato',  email: 'sarah@example.com', service: 'Website Development', read: false, date: '2026-05-09', message: 'Hi, I need a business website for my bakery. Can we discuss pricing and timeline for the project?' },
  { id: 2, name: 'Mike Ssemanda', email: 'mike@biz.ug',       service: 'App Development',      read: false, date: '2026-05-08', message: 'I want to build a delivery tracking app for my logistics company in Kampala. Let us discuss the features needed.' },
  { id: 3, name: 'Grace Tumwine', email: 'grace@hotel.com',   service: 'Website Development',  read: true,  date: '2026-05-08', message: 'We need a hotel booking website with online payment integration and a proper admin panel to manage reservations.' },
  { id: 4, name: 'Peter Okello',  email: 'peter@clinic.ug',   service: 'Branding & Strategy',  read: true,  date: '2026-05-07', message: 'Looking for a complete brand identity package for my new medical clinic that is opening next month in Kampala.' },
  { id: 5, name: 'Fatuma Hassan', email: 'fatuma@shop.ug',    service: 'E-Commerce',           read: true,  date: '2026-05-06', message: 'I have an online clothing store and need it completely redesigned and upgraded with new features and payment options.' },
  { id: 6, name: 'Bob Mugisha',   email: 'bob@school.ac.ug',  service: 'App Development',      read: true,  date: '2026-05-05', message: 'Need a school management app for students, teachers, and parents. Should include attendance, results, and fee tracking.' },
];

export const mediaData = [
  { id: 1, name: 'celutamax-hero.jpg',     type: 'image', size: '2.4 MB', date: '2026-01-15', tag: 'Portfolio',   emoji: '🚗' },
  { id: 2, name: 'deliverygo-screens.png', type: 'image', size: '3.1 MB', date: '2026-02-20', tag: 'Portfolio',   emoji: '📱' },
  { id: 3, name: 'codecanvas-logo.png',    type: 'image', size: '0.3 MB', date: '2025-12-01', tag: 'Brand',       emoji: '🎨' },
  { id: 4, name: 'shopease-preview.jpg',   type: 'image', size: '1.8 MB', date: '2026-03-08', tag: 'Portfolio',   emoji: '🛒' },
  { id: 5, name: 'brand-pack-amara.zip',   type: 'file',  size: '12 MB',  date: '2026-02-03', tag: 'Deliverable', emoji: '📦' },
  { id: 6, name: 'logo-concepts-v2.pdf',   type: 'pdf',   size: '4.5 MB', date: '2026-03-15', tag: 'Draft',       emoji: '📄' },
  { id: 7, name: 'biztrack-wireframe.fig', type: 'file',  size: '8.2 MB', date: '2026-04-11', tag: 'Design',      emoji: '🖌️' },
  { id: 8, name: 'hero-banner-may.jpg',    type: 'image', size: '1.1 MB', date: '2026-05-01', tag: 'Marketing',   emoji: '🌟' },
];

export const recentActivity = [
  { action: 'New message from',   subject: 'Sarah Nakato',    time: '2 min ago',  icon: '💬' },
  { action: 'Project updated:',   subject: 'BizTrack App',    time: '1 hr ago',   icon: '📝' },
  { action: 'Testimonial from',   subject: 'David W.',        time: '3 hrs ago',  icon: '⭐' },
  { action: 'New project added:', subject: 'LuxeStay Hotel',  time: '1 day ago',  icon: '🚀' },
  { action: 'Media uploaded:',    subject: 'hero-banner-may', time: '1 day ago',  icon: '🖼️' },
];