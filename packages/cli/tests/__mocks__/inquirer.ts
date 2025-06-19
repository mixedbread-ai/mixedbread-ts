// Mock inquirer to avoid ESM issues in tests
const mockInquirer = {
  prompt: jest.fn(),
  registerPrompt: jest.fn(),
  createPromptModule: jest.fn(),
};

export default mockInquirer;
