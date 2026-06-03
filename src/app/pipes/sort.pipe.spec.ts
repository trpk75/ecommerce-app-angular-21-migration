import { SortPipe } from './sort.pipe';

describe('SortPipe', () => {
  it('sorts products by name ascending', () => {
    const products = [
      { product_name: 'Nivea', product_price: 180 },
      { product_name: 'Ashirvaad Atta', product_price: 175 }
    ];

    expect(new SortPipe().transform(products, 'product_name|asc')).toEqual([
      { product_name: 'Ashirvaad Atta', product_price: 175 },
      { product_name: 'Nivea', product_price: 180 }
    ]);
  });

  it('sorts products by price descending', () => {
    const products = [
      { product_name: 'Nivea', product_price: 180 },
      { product_name: 'Surf Excel', product_price: 590 }
    ];

    expect(new SortPipe().transform(products, 'product_price|htl')).toEqual([
      { product_name: 'Surf Excel', product_price: 590 },
      { product_name: 'Nivea', product_price: 180 }
    ]);
  });
});
