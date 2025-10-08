'use client';

import { useSearch } from '@/hooks/useSearch';
import SearchInput from '@/components/SearchInput';
import SearchResults from '@/components/SearchResults';

export default function HomePage() {
  const { query, results, loading, error, total, setQuery } = useSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Поиск
          </h1>
          <p className="text-lg text-gray-600">
            Найдется все (почти)
          </p>
        </header>

        <main>
          <div className="mb-8">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Начните вводить React..."
              className="max-w-2xl mx-auto"
            />
          </div>

          <SearchResults
            results={results}
            loading={loading}
            error={error}
            total={total}
            query={query}
          />
        </main>
      </div>
    </div>
  );
}
