import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  const products = [
    { product_name: 'Surf Excel' },
    { product_name: 'Nivea Body Lotion' }
  ];

  it('returns all products when search text is empty', () => {
    expect(new FilterPipe().transform(products, '')).toBe(products);
  });

  it('filters products by product name', () => {
    expect(new FilterPipe().transform(products, 'surf')).toEqual([
      { product_name: 'Surf Excel' }
    ]);
  });
});
