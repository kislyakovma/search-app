import { GET } from '@/app/api/search/route';

describe('/api/search', () => {
  it('should return empty results when no query provided', async () => {
    const request = {
      url: 'http://localhost:3000/api/search'
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toEqual([]);
    expect(data.total).toBe(0);
    expect(data.query).toBe('');
  });

  it('should return search results for valid query', async () => {
    const request = {
      url: 'http://localhost:3000/api/search?q=react'
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toBeInstanceOf(Array);
    expect(data.total).toBeGreaterThan(0);
    expect(data.query).toBe('react');
    expect(data.timestamp).toBeDefined();
  });

  it('should filter results by title', async () => {
    const request = {
      url: 'http://localhost:3000/api/search?q=React'
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results.every((result: any) => 
      result.title.toLowerCase().includes('react') ||
      result.description.toLowerCase().includes('react') ||
      result.category.toLowerCase().includes('react')
    )).toBe(true);
  });

  it('should filter results by description', async () => {
    const request = {
      url: 'http://localhost:3000/api/search?q=documentation'
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results.every((result: any) => 
      result.title.toLowerCase().includes('documentation') ||
      result.description.toLowerCase().includes('documentation') ||
      result.category.toLowerCase().includes('documentation')
    )).toBe(true);
  });

  it('should return empty results for non-matching query', async () => {
    const request = {
      url: 'http://localhost:3000/api/search?q=xyz123nonexistent'
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toEqual([]);
    expect(data.total).toBe(0);
  });

  it('should be case insensitive', async () => {
    const request1 = {
      url: 'http://localhost:3000/api/search?q=react'
    } as any;
    const request2 = {
      url: 'http://localhost:3000/api/search?q=REACT'
    } as any;
    
    const response1 = await GET(request1);
    const response2 = await GET(request2);
    
    const data1 = await response1.json();
    const data2 = await response2.json();

    expect(data1.results).toEqual(data2.results);
  });
});
