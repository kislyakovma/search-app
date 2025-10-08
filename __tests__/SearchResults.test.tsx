import { render, screen } from '@testing-library/react';
import SearchResults from '@/components/SearchResults';
import { SearchResult } from '@/types';

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Test Result 1',
    description: 'This is a test description',
    url: 'https://example.com/1',
    category: 'Test',
  },
  {
    id: '2',
    title: 'Test Result 2',
    description: 'Another test description',
    url: 'https://example.com/2',
    category: 'Example',
  },
];

describe('SearchResults', () => {
  it('should show loading state', () => {
    render(
      <SearchResults
        results={[]}
        loading={true}
        error={null}
        total={0}
        query="test"
      />
    );

    expect(screen.getByText('Поиск...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    render(
      <SearchResults
        results={[]}
        loading={false}
        error="Network error"
        total={0}
        query="test"
      />
    );

    expect(screen.getByText('Ошибка')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('should show empty state when no query', () => {
    render(
      <SearchResults
        results={[]}
        loading={false}
        error={null}
        total={0}
        query=""
      />
    );

    expect(screen.getByText('Введите запрос')).toBeInTheDocument();
  });

  it('should show no results state', () => {
    render(
      <SearchResults
        results={[]}
        loading={false}
        error={null}
        total={0}
        query="nonexistent"
      />
    );

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
    expect(screen.getByText('Попробуйте другой запрос')).toBeInTheDocument();
  });

  it('should display search results', () => {
    render(
      <SearchResults
        results={mockResults}
        loading={false}
        error={null}
        total={2}
        query="test"
      />
    );

    expect(screen.getByText(/Найдено 2 результата по запросу "test"/)).toBeInTheDocument();
    expect(screen.getByText('Test Result 1')).toBeInTheDocument();
    expect(screen.getByText('Test Result 2')).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
    expect(screen.getByText('Another test description')).toBeInTheDocument();
  });

  it('should display correct singular form for single result', () => {
    render(
      <SearchResults
        results={[mockResults[0]]}
        loading={false}
        error={null}
        total={1}
        query="test"
      />
    );

    expect(screen.getByText(/Найдено 1 результат по запросу "test"/)).toBeInTheDocument();
  });

  it('should render result links with correct attributes', () => {
    render(
      <SearchResults
        results={[mockResults[0]]}
        loading={false}
        error={null}
        total={1}
        query="test"
      />
    );

    const link = screen.getByRole('link', { name: 'Test Result 1' });
    expect(link).toHaveAttribute('href', 'https://example.com/1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
