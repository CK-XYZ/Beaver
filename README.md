# Beaver

![npm downloads](https://img.shields.io/npm/dt/beaver-js-logger.svg)
![npm version](https://img.shields.io/npm/v/beaver-js-logger.svg)
![license](https://img.shields.io/npm/l/beaver-js-logger.svg)

## Introduction

Modern JavaScript/TypeScript logging middleware for custom and conditional logs. Beaver offers production-ready logging with customizable log levels, remote logging via webhooks, and asynchronous support for optimal performance.

## ✨ Features

- 🎯 **Environment-specific logging** - Different log levels for development and production
- 🎨 **Customizable log levels** - Define your own log levels with custom colors
- 🌐 **Remote logging** - Send logs to external services via webhook
- ⚡ **Asynchronous logging** - Non-blocking logging for performance optimization
- 📦 **TypeScript support** - Full TypeScript definitions included
- 🔒 **Production-ready** - Secure dependencies and proper error handling
- 🧪 **Well-tested** - Comprehensive test suite included
- 🎭 **Browser & Node.js** - Works seamlessly in both environments

## 📦 Installation

Install Beaver using npm or yarn:

```bash
npm install beaver-js-logger
# or
yarn add beaver-js-logger
```

## 🚀 Quick Start

```javascript
const Beaver = require('beaver-js-logger');

// Create a logger instance
const logger = Beaver('MyApp');

// Start logging!
logger.log('Application started');
logger.info('User logged in');
logger.warn('Cache miss');
logger.error('Connection failed');
```

## 📖 Usage

### Basic Configuration

```javascript
const Beaver = require('beaver-js-logger');

const logger = Beaver('MyComponent', {
  asyncLogging: true,
  includeLineInfo: true,
});

logger.log('This is a log message');
logger.warn('This is a warning');
logger.error('This is an error');
```

### Advanced Configuration

```javascript
const loggerConfig = {
  // Environment configuration
  environments: {
    development: ['localhost', '127.0.0.1'],
    production: ['yourproductiondomain.com'],
  },

  // Custom log levels with colors
  logLevels: {
    // Standard levels
    important: { color: '#AA00AA', background: '#000000', production: true },
    log: { color: '#0077FF', background: '#000000', production: false },
    info: { color: '#00AA00', background: '#000000', production: false },
    warn: { color: '#FFA500', background: '#000000', production: true },
    error: { color: '#FF0000', background: '#000000', production: true },

    // Custom levels
    debug: { color: '#00FFFF', background: '#000033', production: false },
    critical: { color: '#FF00FF', background: '#000000', production: true },
  },

  // Async logging for better performance
  asyncLogging: true,

  // Include source line information
  includeLineInfo: true,

  // Remote logging via webhook
  useWebhook: true,
  webhookUrl: 'https://your-logging-service.com/webhook',

  // Force logging regardless of environment
  forceLog: false,
};

const logger = Beaver('MyApp', loggerConfig);
```

### TypeScript Usage

```typescript
import Beaver, { BeaverConfig, Logger } from 'beaver-js-logger';

const config: BeaverConfig = {
  asyncLogging: true,
  includeLineInfo: true,
  logLevels: {
    debug: { color: '#00FFFF', background: '#000000', production: false },
  },
};

const logger: Logger = Beaver('MyApp', config);
logger.debug('Debug message with TypeScript!');
```

### Logging with Metadata

```javascript
const logger = Beaver('UserService');

// Add structured metadata to logs
logger.info('User action', {
  userId: 12345,
  action: 'login',
  timestamp: Date.now(),
});

logger.error('Payment failed', {
  orderId: 'ORD-789',
  amount: 99.99,
  reason: 'insufficient_funds',
});
```

### Grouped Logs

```javascript
const logger = Beaver('DataProcessor');

logger.group('Processing batch');
logger.log('Step 1: Validation');
logger.log('Step 2: Transformation');
logger.log('Step 3: Storage');
logger.groupEnd();
```

### Webhook Integration

Send logs to external services for centralized logging:

```javascript
const logger = Beaver('API', {
  useWebhook: true,
  webhookUrl: 'https://logs.example.com/webhook',
});

// Logs will be sent to your webhook with this payload:
// {
//   level: 'error',
//   message: '[ERROR | ...] API | Something went wrong',
//   metadata: { ... },
//   componentName: 'API',
//   timestamp: '2026-01-18T15:42:17.827Z',
//   environment: 'production'
// }

logger.error('Something went wrong', { errorCode: 500 });
```

## ⚙️ Configuration Options

| Option            | Type      | Default                                                       | Description                                       |
| ----------------- | --------- | ------------------------------------------------------------- | ------------------------------------------------- |
| `environments`    | `Object`  | `{ development: ['localhost', '127.0.0.1'], production: [] }` | Map hostnames to environments                     |
| `logLevels`       | `Object`  | See defaults                                                  | Custom log levels with color and production flags |
| `asyncLogging`    | `Boolean` | `false`                                                       | Enable non-blocking asynchronous logging          |
| `includeLineInfo` | `Boolean` | `true`                                                        | Include source line information in logs           |
| `useWebhook`      | `Boolean` | `false`                                                       | Enable remote logging via webhook                 |
| `webhookUrl`      | `String`  | `null`                                                        | URL endpoint for webhook logging                  |
| `logFilter`       | `String`  | `null`                                                        | Filter logs to specific level only                |
| `forceLog`        | `Boolean` | `false`                                                       | Force logging regardless of environment settings  |

## 🎨 Default Log Levels

- **important** - Purple, logs in production
- **log** - Blue, development only
- **info** - Green, development only
- **warn** - Orange, logs in production
- **error** - Red, logs in production

## 🛠️ API Reference

### Logger Methods

- `logger.log(message, metadata?)` - Log at 'log' level
- `logger.info(message, metadata?)` - Log informational messages
- `logger.warn(message, metadata?)` - Log warnings
- `logger.error(message, metadata?)` - Log errors
- `logger.important(message, metadata?)` - Log important messages
- `logger.group(title)` - Start a collapsible log group
- `logger.groupEnd()` - End the current log group
- `logger.getEnvironment()` - Get current environment ('development' or 'production')
- `logger.getConfig()` - Get current configuration (read-only copy)

### Custom Log Levels

You can add any custom log level:

```javascript
const logger = Beaver('App', {
  logLevels: {
    success: { color: '#00FF00', background: '#000000', production: true },
    trace: { color: '#888888', background: '#000000', production: false },
  },
});

logger.success('Operation completed successfully!');
logger.trace('Entering function calculateTotal()');
```

## 🧪 Testing

This package includes a comprehensive test suite:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔒 Security

- Updated to axios 1.x to address known vulnerabilities
- Webhook requests have a 5-second timeout to prevent hanging
- Proper error handling prevents information leakage
- Input validation for all configuration options

## 📝 Examples

### Example 1: Simple App Logging

```javascript
const Beaver = require('beaver-js-logger');
const logger = Beaver('TodoApp');

function addTodo(todo) {
  logger.info('Adding todo', { title: todo.title });
  // ... add todo logic
  logger.log('Todo added successfully');
}
```

### Example 2: API Server Logging

```javascript
const Beaver = require('beaver-js-logger');
const logger = Beaver('APIServer', {
  useWebhook: true,
  webhookUrl: process.env.LOG_WEBHOOK_URL,
  logLevels: {
    request: { color: '#00AAFF', background: '#000000', production: true },
    response: { color: '#00FF00', background: '#000000', production: true },
  },
});

app.use((req, res, next) => {
  logger.request(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});
```

### Example 3: Development vs Production

```javascript
const Beaver = require('beaver-js-logger');

const logger = Beaver('DataService', {
  environments: {
    development: ['localhost', '127.0.0.1', 'dev.example.com'],
    production: ['api.example.com', 'example.com'],
  },
});

// This will only log in development
logger.log('Detailed debug information');

// This will log in both environments
logger.error('Critical error occurred');
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 🙏 Acknowledgments

Created with ❤️ by FiendsXYZ

            ██  ██████████████▓▓██  ████
          ██▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██
          ██▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██
            ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
          ██▒▒▒▒▒▒██▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▓▓
        ██▒▒▒▒▒▒▒▒██▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒██
      ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
    ██▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
    ██▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒██  ░░
    ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒██
    ██▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒██
    ██▒▒▒▒▓▓██████████████████▓▓▒▒▒▒▒▒▒▒▒▒▓▓▒▒██
    ▓▓▒▒▒▒▒▒▓▓██    ██    ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒██
    ██▒▒▒▒▒▒▒▒██    ██    ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██
    ██▒▒▒▒▒▒▒▒██    ██    ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒██
    ██▓▓▒▒▒▒▒▒▒▒██████████▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒██
      ██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██░░██▒▒▒▒▒▒▒▒▒▒▓▓▒▒██
        ████▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██░░▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▓▓▒▒██
            ████▓▓▒▒▓▓██████▓▓██░░▒▒██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒██    ████████
                ██▓▓██▒▒▒▒▓▓██░░▒▒██▓▓▒▒▒▒██▒▒▒▒██▒▒▓▓▒▒██  ██▒▒▒▒▒▒▒▒██
                ██▒▒▒▒▒▒▓▓██░░▒▒▒▒▒▒██▓▓▒▒▒▒▒▒▓▓██▒▒▒▒▓▓▒▒██▒▒▓▓▓▓▒▒▓▓▒▒██
                ██▓▓▓▓▓▓██░░▒▒▒▒▒▒██▓▓██▓▓▓▓▓▓██▓▓▒▒▒▒▒▒▒▒██▓▓▒▒▓▓▓▓▓▓▓▓██
                ██████████▒▒▒▒▒▒██▓▓▓▓▓▓██████▓▓▒▒▒▒▓▓▒▒▒▒██▓▓▓▓▓▓▓▓▒▒▓▓██
                ██▓▓██░░░░██▒▒▒▒██▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒██▓▓▓▓▓▓▓▓▓▓▓▓██
                ██▓▓▓▓██░░░░████▒▒██▒▒▒▒▓▓▒▒▒▒▒▒▓▓▒▒▒▒▒▒▒▒██▓▓▒▒▓▓▓▓▓▓████
                  ██▓▓▓▓████▓▓▓▓██▒▒██▒▒▒▒▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓▓▓▓▓▓▓████
                  ██▓▓▓▓▓▓▓▓▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██▓▓▓▓▒▒████
                ██████▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██████████████████████
              ██░░░░░░██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██░░░░░░░░░░░░████████
            ██▒▒██▒▒▒▒▒▒██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██▒▒▒▒▒▒██▒▒██▒▒▒▒██
            ██▓▓██████████████▓▓████████████████████████████▓▓
