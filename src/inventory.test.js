import { applyMovementChirho, getInventoryMetricsChirho } from './inventory';

const productsChirho = [
  {
    id: 'prod-a',
    quantity: 4,
    minStock: 5,
    price: 10,
    syncStatus: 'pending'
  },
  {
    id: 'prod-b',
    quantity: 8,
    minStock: 3,
    price: 20,
    syncStatus: 'synced'
  }
];

test('calculates inventory metrics', () => {
  const metricsChirho = getInventoryMetricsChirho(productsChirho, [
    { id: 'mov-a', syncStatus: 'pending' },
    { id: 'mov-b', syncStatus: 'synced' }
  ]);

  expect(metricsChirho.totalProducts).toBe(2);
  expect(metricsChirho.lowStockCount).toBe(1);
  expect(metricsChirho.pendingSyncCount).toBe(2);
  expect(metricsChirho.inventoryValue).toBe(200);
});

test('applies entry and exit movements without negative stock', () => {
  const withEntryChirho = applyMovementChirho(productsChirho[0], 'entry', 3, false);
  const withExitChirho = applyMovementChirho(productsChirho[0], 'exit', 10, false);

  expect(withEntryChirho.quantity).toBe(7);
  expect(withEntryChirho.syncStatus).toBe('pending');
  expect(withExitChirho.quantity).toBe(0);
});
