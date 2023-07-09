import { lookupConfigValue } from '../index';
test('My Greeter', () => {
  expect(lookupConfigValue('whatever')).toBe('Hello world');
});