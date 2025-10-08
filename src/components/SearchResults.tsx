'use client';

import { SearchResult } from '@/types';
import { pluralizeRus } from '@/utils/pluralizeRus';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  total: number;
  query: string;
}

export default function SearchResults({ 
  results, 
  loading, 
  error, 
  total, 
  query 
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">Поиск...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-medium mb-2">Ошибка</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Введите запрос</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Ничего не найдено</div>
        <div className="text-gray-400">Попробуйте другой запрос</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Найдено {total} {pluralizeRus(total, ['результат', 'результата', 'результатов'])} по запросу "{query}"
      </div>
      
      <div className="space-y-3">
        {results.map((result) => (
          <SearchResultItem key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}

function SearchResultItem({ result }: { result: SearchResult }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {result.title}
            </a>
          </h3>
          <p className="text-gray-600 text-sm mb-2">{result.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">{result.category}</span>
            <span className="truncate">{result.url}</span>
          </div>
        </div>
        <div className="ml-4">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
