// Mock glob to avoid ESM issues in tests
const mockGlob = {
  glob: jest.fn(),
  globSync: jest.fn(),
  globStream: jest.fn(),
  globStreamSync: jest.fn(),
  Glob: jest.fn(),
  minimatch: jest.fn(),
  hasMagic: jest.fn(),
  escape: jest.fn(),
  unescape: jest.fn(),
};

export default mockGlob;
export const { glob, globSync, globStream, globStreamSync, Glob, minimatch, hasMagic, escape, unescape } = mockGlob;