// Mock glob to avoid ESM issues in tests
const mockGlob = {
  glob: jest.fn(),
};

export default mockGlob;
export const { glob } = mockGlob;
