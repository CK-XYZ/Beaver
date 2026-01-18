/**
 * Unit tests for Beaver logger
 */

const Beaver = require('./Beaver');

// Mock axios
jest.mock('axios');
const axios = require('axios');

describe('Beaver Logger', () => {
  let consoleLogSpy;
  let consoleErrorSpy;
  let consoleWarnSpy;
  let consoleInfoSpy;

  beforeEach(() => {
    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();

    // Reset axios mock
    axios.post = jest.fn().mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    // Restore console methods
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create a logger instance with component name', () => {
      const logger = Beaver('TestComponent');
      expect(logger).toBeDefined();
      expect(typeof logger.log).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
    });

    it('should throw error if component name is missing', () => {
      expect(() => Beaver()).toThrow('componentName is required and must be a string');
    });

    it('should throw error if component name is not a string', () => {
      expect(() => Beaver(123)).toThrow('componentName is required and must be a string');
    });

    it('should throw error if webhook is enabled without URL', () => {
      expect(() => Beaver('Test', { useWebhook: true })).toThrow(
        'webhookUrl is required when useWebhook is true'
      );
    });

    it('should create logger with custom log levels', () => {
      const logger = Beaver('TestComponent', {
        logLevels: {
          debug: { color: '#FFFFFF', background: '#000000', production: false },
        },
      });
      expect(typeof logger.debug).toBe('function');
    });
  });

  describe('Basic Logging', () => {
    it('should log messages at different levels', () => {
      const logger = Beaver('TestComponent', { forceLog: true });

      logger.log('Test log message');
      logger.info('Test info message');
      logger.warn('Test warn message');
      logger.error('Test error message');

      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should include component name in log message', () => {
      const logger = Beaver('MyComponent', { forceLog: true });
      logger.log('Test message');

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('MyComponent'));
    });

    it('should include log level in message', () => {
      const logger = Beaver('TestComponent', { forceLog: true });
      logger.error('Test error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR'));
    });

    it('should handle metadata object', () => {
      const logger = Beaver('TestComponent', { forceLog: true });
      logger.log('Test message', { userId: 123, action: 'click' });

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Metadata:'));
    });
  });

  describe('Environment Configuration', () => {
    it('should respect production flag for log levels', () => {
      const logger = Beaver('TestComponent', {
        environments: {
          development: [],
          production: ['node'],
        },
      });

      // log has production: false by default
      logger.log('Should not log in production');
      expect(consoleLogSpy).not.toHaveBeenCalled();

      // error has production: true by default
      logger.error('Should log in production');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should force logging when forceLog is true', () => {
      const logger = Beaver('TestComponent', {
        environments: {
          development: [],
          production: ['node'],
        },
        forceLog: true,
      });

      logger.log('Should log despite production setting');
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('Log Filtering', () => {
    it('should filter logs to specific level', () => {
      const logger = Beaver('TestComponent', {
        logFilter: 'error',
        forceLog: true,
      });

      logger.log('Should not appear');
      logger.error('Should appear');

      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Line Information', () => {
    it('should include line info when enabled', () => {
      const logger = Beaver('TestComponent', {
        includeLineInfo: true,
        forceLog: true,
      });

      logger.log('Test message');

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('at '));
    });

    it('should exclude line info when disabled', () => {
      const logger = Beaver('TestComponent', {
        includeLineInfo: false,
        forceLog: true,
      });

      logger.log('Test message');

      const callArg = consoleLogSpy.mock.calls[0][0];
      // Check that line info pattern is not present
      expect(callArg).not.toMatch(/at Object\./);
    });
  });

  describe('Webhook Integration', () => {
    it('should send logs to webhook when enabled', async () => {
      const logger = Beaver('TestComponent', {
        useWebhook: true,
        webhookUrl: 'https://example.com/webhook',
        forceLog: true,
      });

      logger.log('Test webhook message');

      // Wait for async webhook call
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(axios.post).toHaveBeenCalledWith(
        'https://example.com/webhook',
        expect.objectContaining({
          level: 'log',
          componentName: 'TestComponent',
        }),
        expect.any(Object)
      );
    });

    it('should handle webhook errors gracefully', async () => {
      axios.post = jest.fn().mockRejectedValue(new Error('Network error'));

      const logger = Beaver('TestComponent', {
        useWebhook: true,
        webhookUrl: 'https://example.com/webhook',
        forceLog: true,
      });

      // Should not throw
      expect(() => logger.log('Test message')).not.toThrow();

      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  });

  describe('Async Logging', () => {
    it('should log asynchronously when enabled', (done) => {
      const logger = Beaver('TestComponent', {
        asyncLogging: true,
        forceLog: true,
      });

      logger.log('Async message');

      // Log should not be called immediately
      expect(consoleLogSpy).not.toHaveBeenCalled();

      // But should be called after event loop
      setTimeout(() => {
        expect(consoleLogSpy).toHaveBeenCalled();
        done();
      }, 10);
    });
  });

  describe('Group Functions', () => {
    let consoleGroupCollapsedSpy;
    let consoleGroupEndSpy;

    beforeEach(() => {
      consoleGroupCollapsedSpy = jest.spyOn(console, 'groupCollapsed').mockImplementation();
      consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation();
    });

    afterEach(() => {
      consoleGroupCollapsedSpy.mockRestore();
      consoleGroupEndSpy.mockRestore();
    });

    it('should create log groups in development', () => {
      const logger = Beaver('TestComponent', {
        environments: {
          development: ['node'],
          production: [],
        },
      });

      logger.group('Test Group');
      logger.groupEnd();

      expect(consoleGroupCollapsedSpy).toHaveBeenCalled();
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });
  });

  describe('Utility Methods', () => {
    it('should return current environment', () => {
      const logger = Beaver('TestComponent');
      const env = logger.getEnvironment();
      expect(['development', 'production']).toContain(env);
    });

    it('should return configuration copy', () => {
      const config = {
        asyncLogging: true,
        includeLineInfo: false,
      };
      const logger = Beaver('TestComponent', config);
      const returnedConfig = logger.getConfig();

      expect(returnedConfig.asyncLogging).toBe(true);
      expect(returnedConfig.includeLineInfo).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle circular metadata gracefully', () => {
      const logger = Beaver('TestComponent', { forceLog: true });
      const circular = { a: 1 };
      circular.self = circular;

      expect(() => logger.log('Test', circular)).not.toThrow();
    });

    it('should handle empty metadata', () => {
      const logger = Beaver('TestComponent', { forceLog: true });
      logger.log('Test', {});

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle missing console methods', () => {
      const originalConsole = global.console;
      global.console = {};

      expect(() => {
        const logger = Beaver('TestComponent', { forceLog: true });
        logger.log('Test');
      }).not.toThrow();

      global.console = originalConsole;
    });
  });
});
