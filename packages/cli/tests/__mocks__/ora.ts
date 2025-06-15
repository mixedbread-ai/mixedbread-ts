// Mock ora to avoid ESM issues in tests
const mockOra = jest.fn(() => ({
  start: jest.fn().mockReturnThis(),
  succeed: jest.fn((message?: string) => {
    if (message) {
      console.log('✓', message);
    }
    return this;
  }),
  info: jest.fn((message?: string) => {
    if (message) {
      console.log(message);
    }
    return this;
  }),
  fail: jest.fn((message?: string) => {
    if (message) {
      console.log('✗', message);
    }
    return this;
  }),
  stop: jest.fn().mockReturnThis(),
  text: '',
}));

export default mockOra;
