// TypeScript test script for the formatSize function
// Run with: npx ts-node test-format-size.ts

// Import the formatSize function
import { formatSize } from './app/lib/format';

// Test cases
interface TestCase {
  input: number;
  expected: string;
}

const testCases: TestCase[] = [
  { input: 0, expected: '0 B' },
  { input: -100, expected: 'Invalid size' },
  { input: 500, expected: '500 B' },
  { input: 1023, expected: '1023 B' },
  { input: 1024, expected: '1.00 KB' },
  { input: 1536, expected: '1.50 KB' },
  { input: 1048576, expected: '1.00 MB' },
  { input: 1073741824, expected: '1.00 GB' },
  { input: 1099511627776, expected: '1.00 TB' },
  { input: 2.5 * 1024 * 1024, expected: '2.50 MB' },
  { input: 20 * 1024 * 1024, expected: '20.00 MB' }, // Max file size in FileUploader
];

// Run tests
console.log('Testing formatSize function:');
console.log('----------------------------');

let passedTests = 0;
let failedTests = 0;

testCases.forEach((test, index) => {
  const result = formatSize(test.input);
  const passed = result === test.expected;
  
  console.log(`Test ${index + 1}: ${passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  Input: ${test.input} bytes`);
  console.log(`  Expected: "${test.expected}"`);
  console.log(`  Actual: "${result}"`);
  console.log('----------------------------');
  
  if (passed) {
    passedTests++;
  } else {
    failedTests++;
  }
});

console.log(`Summary: ${passedTests} passed, ${failedTests} failed`);

// Exit with appropriate code
process.exit(failedTests > 0 ? 1 : 0);