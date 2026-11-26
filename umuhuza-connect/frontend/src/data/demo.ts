export type Job = {
  id: number; title: string; company: string; location: string; type: string;
  salary: string; category: string; match: number; logo: string; posted: string;
}
export const jobs: Job[] = [
  { id: 1, title: 'Frontend Developer', company: 'Kigali Digital Labs', location: 'Kigali, Rwanda', type: 'Full-time', salary: 'RWF 900k–1.4M', category: 'Technology', match: 96, logo: 'KD', posted: '2h ago' },
  { id: 2, title: 'Product Designer', company: 'Imanzi Studio', location: 'Hybrid · Kigali', type: 'Full-time', salary: 'RWF 700k–1.1M', category: 'Design', match: 91, logo: 'IS', posted: '5h ago' },
  { id: 3, title: 'Customer Success Associate', company: 'Akazi Cloud', location: 'Kigali, Rwanda', type: 'Full-time', salary: 'RWF 500k–750k', category: 'Business', match: 87, logo: 'AC', posted: '1d ago' },
  { id: 4, title: 'Junior Data Analyst', company: 'Inzira Analytics', location: 'Remote · Rwanda', type: 'Contract', salary: 'RWF 600k–900k', category: 'Technology', match: 83, logo: 'IA', posted: '1d ago' },
]
export const products = [
  { id: 1, name: 'Brand identity package', seller: 'Imanzi Creative', price: 'RWF 85,000', category: 'Design service', icon: '✳' },
  { id: 2, name: 'Handmade sisal basket', seller: 'Umutima Crafts', price: 'RWF 18,000', category: 'Home & living', icon: '◉' },
  { id: 3, name: 'Website starter package', seller: 'Kigali Web Works', price: 'RWF 150,000', category: 'Digital service', icon: '⌘' },
]
export const activities = [
  { icon: 'briefcase', title: 'New role matched your profile', detail: 'Frontend Developer · Kigali Digital Labs', time: '12 min ago' },
  { icon: 'users', title: 'Connection request received', detail: 'Aline M. · Product Designer', time: '1 hour ago' },
  { icon: 'graduation', title: 'Your learning plan is ready', detail: 'React fundamentals · 4 lessons', time: 'Yesterday' },
]
