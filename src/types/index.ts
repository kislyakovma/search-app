export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  timestamp: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  total: number;
}
