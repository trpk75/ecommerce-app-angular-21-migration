import { CartService } from './cart.service';
import { StorageService } from './storage.service';

describe('CartService', () => {
  let storage: StorageService;
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    storage = new StorageService();
    service = new CartService(storage);
    service.allItems = [
      { p_id: '1', product_name: 'Surf Excel', product_price: 590 },
      { p_id: '2', product_name: 'Nivea', product_price: 180 }
    ];
  });

  it('adds products and calculates cart totals', () => {
    service.addToCart('1', 2, '');
    service.addToCart('2', 1, '');

    expect(service.cartItemsList).toEqual([
      { pid: '1', name: 'Surf Excel', qty: 2, price: 1180 },
      { pid: '2', name: 'Nivea', qty: 1, price: 180 }
    ]);
    expect(service.cartTotal).toBe(1360);
  });

  it('replaces quantities and removes zero-quantity items', () => {
    service.addToCart('1', 3, '');
    service.addToCart('1', 0, 'replace');

    expect(service.cartItemsList).toEqual([]);
    expect(service.cartTotal).toBe(0);
  });

  it('empties the cart in memory and storage', () => {
    service.addToCart('1', 1, '');
    service.emptyCart();

    expect(service.cartItemsList).toEqual([]);
    expect(service.cartTotal).toBe(0);
    expect(storage.get('mycart')).toEqual({});
  });
});
