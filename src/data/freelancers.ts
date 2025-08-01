export interface Freelancer {
  id: string;
  name: string;
  description: string;
  rating: number;
  categories: string[];
  reviews?: { user: string; comment: string }[];
}

const freelancers: Freelancer[] = [
  {
    id: '1',
    name: 'John Doe',
    description: 'Experienced Web3 developer',
    rating: 4.8,
    categories: ['Developer', 'Smart Contract'],
    reviews: [
      { user: 'Alice', comment: 'Very fast and smart developer.' },
      { user: 'Bob', comment: 'Delivered ahead of time.' },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    description: 'Crypto influencer & shiller',
    rating: 4.6,
    categories: ['Shiller', 'Marketing'],
    reviews: [{ user: 'CEO of XYZ', comment: 'Boosted our project hard!' }],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    description: 'Frontend dev with Tailwind & Next.js skills',
    rating: 4.7,
    categories: ['Developer'],
    reviews: [],
  },
  {
    id: '4',
    name: 'Sophia Li',
    description: 'NFT designer and UI/UX expert',
    rating: 4.9,
    categories: ['Designer'],
    reviews: [
      { user: 'CryptoArtz', comment: 'Gave our NFTs premium branding.' },
    ],
  },
];

export default freelancers;
