/**
 * Example usage of Beaver logger
 * Run with: node examples/basic-usage.js
 */

const Beaver = require('../Beaver');

console.log('=== Beaver Logger Examples ===\n');

// Example 1: Basic usage
console.log('1. Basic Usage:');
const logger1 = Beaver('BasicApp', { forceLog: true, includeLineInfo: false });
logger1.log('Application started');
logger1.info('Processing data...');
logger1.warn('Cache miss detected');
logger1.error('Connection timeout');

console.log('\n2. With Metadata:');
const logger2 = Beaver('UserService', { forceLog: true, includeLineInfo: false });
logger2.info('User logged in', {
  userId: 12345,
  username: 'john_doe',
  timestamp: new Date().toISOString(),
});

console.log('\n3. Custom Log Levels:');
const logger3 = Beaver('API', {
  forceLog: true,
  includeLineInfo: false,
  logLevels: {
    success: { color: '#00FF00', background: '#000000', production: true },
    debug: { color: '#888888', background: '#000000', production: false },
  },
});
logger3.success('Request completed successfully');
logger3.debug('Request took 145ms');

console.log('\n4. Log Groups:');
const logger4 = Beaver('DataProcessor', { forceLog: true, includeLineInfo: false });
logger4.group('Processing Batch #123');
logger4.log('Step 1: Validation - OK');
logger4.log('Step 2: Transformation - OK');
logger4.log('Step 3: Storage - OK');
logger4.groupEnd();

console.log('\n5. Async Logging (with delay):');
const logger5 = Beaver('AsyncApp', {
  forceLog: true,
  asyncLogging: true,
  includeLineInfo: false,
});
logger5.log('This message is logged asynchronously');

console.log('\n6. Important Messages:');
const logger6 = Beaver('CriticalSystem', { forceLog: true, includeLineInfo: false });
logger6.important('System health check: PASSED');

// Wait for async logs to complete
setTimeout(() => {
  console.log('\n=== Examples Complete ===');
}, 100);
