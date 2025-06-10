// Mock chalk to avoid ESM issues in tests
const chalk = {
  red: (str: string) => str,
  green: (str: string) => str,
  yellow: (str: string) => str,
  blue: (str: string) => str,
  cyan: (str: string) => str,
  gray: (str: string) => str,
  bold: (str: string) => str,
};

export default chalk;
