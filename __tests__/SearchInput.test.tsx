import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchInput from '@/components/SearchInput';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

describe('SearchInput', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('should render input with placeholder', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        placeholder="Search here..."
      />
    );

    const input = screen.getByPlaceholderText('Search here...');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(mockOnChange).toHaveBeenCalledWith('test query');
  });

  it('should update URL when input value changes', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(mockReplace).toHaveBeenCalledWith('?q=test%20query', { scroll: false });
  });

  it('should remove query param when input is empty', () => {
    const mockOnChange = jest.fn();
    
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockReplace).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('should sync with URL params on mount', () => {
    const mockOnChange = jest.fn();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('q=initial%20query'));
    
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
      />
    );

    expect(mockOnChange).toHaveBeenCalledWith('initial query');
  });
});
