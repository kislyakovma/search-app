import { NextRequest, NextResponse } from 'next/server';
import { SearchResponse } from '@/types';

const mockData = [
  {
    id: '1',
    title: 'React Documentation',
    description: 'Official React documentation and guides',
    url: 'https://react.dev',
    category: 'Documentation',
  },
  {
    id: '2',
    title: 'Next.js Tutorial',
    description: 'Learn Next.js with step-by-step tutorials',
    url: 'https://nextjs.org/learn',
    category: 'Tutorial',
  },
  {
    id: '3',
    title: 'TypeScript Handbook',
    description: 'Complete TypeScript documentation',
    url: 'https://www.typescriptlang.org/docs',
    category: 'Documentation',
  },
  {
    id: '4',
    title: 'JavaScript MDN',
    description: 'Mozilla Developer Network JavaScript reference',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    category: 'Reference',
  },
  {
    id: '5',
    title: 'CSS Tricks',
    description: 'CSS techniques and tricks for modern web development',
    url: 'https://css-tricks.com',
    category: 'Tutorial',
  },
  {
    id: '6',
    title: 'React Hooks Guide',
    description: 'Complete guide to React Hooks',
    url: 'https://react.dev/reference/react',
    category: 'Guide',
  },
  {
    id: '7',
    title: 'Node.js Documentation',
    description: 'Official Node.js documentation',
    url: 'https://nodejs.org/docs',
    category: 'Documentation',
  },
  {
    id: '8',
    title: 'Webpack Guide',
    description: 'Module bundler for modern JavaScript applications',
    url: 'https://webpack.js.org/guides',
    category: 'Guide',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [], total: 0, query: '', timestamp: Date.now() });
  }

  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

  const filteredResults = mockData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const response: SearchResponse = {
    results: filteredResults,
    total: filteredResults.length,
    query,
    timestamp: Date.now(),
  };

  return NextResponse.json(response);
}
