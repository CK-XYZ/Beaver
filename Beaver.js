/**
 * Beaver - Modern JavaScript logging middleware
 * @module beaver-js-logger
 */

const axios = require('axios');

const ENV_DEVELOPMENT = 'development';
const ENV_PRODUCTION = 'production';

// Standard console methods that should map directly
const STANDARD_CONSOLE_METHODS = ['log', 'info', 'warn', 'error'];

/**
 * Validates the logger configuration
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config) {
  if (config.useWebhook && !config.webhookUrl) {
    throw new Error('webhookUrl is required when useWebhook is true');
  }

  if (config.webhookUrl && typeof config.webhookUrl !== 'string') {
    throw new Error('webhookUrl must be a string');
  }

  if (config.logLevels && typeof config.logLevels !== 'object') {
    throw new Error('logLevels must be an object');
  }
}

/**
 * Merges log levels from default and user config
 * @param {Object} defaultLevels - Default log levels
 * @param {Object} userLevels - User-provided log levels
 * @returns {Object} Merged log levels
 */
function mergeLogLevels(defaultLevels, userLevels = {}) {
  const merged = { ...defaultLevels };

  Object.keys(userLevels).forEach((level) => {
    merged[level] = { ...defaultLevels[level], ...userLevels[level] };
  });

  return merged;
}

/**
 * Creates a logger instance for a specific component
 * @param {string} componentName - Name of the component using the logger
 * @param {Object} userConfig - User configuration options
 * @returns {Object} Logger instance with log methods
 */
function Beaver(componentName, userConfig = {}) {
  // Validate component name
  if (!componentName || typeof componentName !== 'string') {
    throw new Error('componentName is required and must be a string');
  }

  const defaultConfig = {
    environments: {
      development: ['localhost', '127.0.0.1'],
      production: [],
    },
    logLevels: {
      important: { color: '#AA00AA', background: '#000000', production: true },
      log: { color: '#0077FF', background: '#000000', production: false },
      info: { color: '#00AA00', background: '#000000', production: false },
      warn: { color: '#FFA500', background: '#000000', production: true },
      error: { color: '#FF0000', background: '#000000', production: true },
    },
    asyncLogging: false,
    includeLineInfo: true,
    useWebhook: false,
    webhookUrl: null,
    logFilter: null,
    forceLog: false,
  };

  // Merge configurations
  const finalConfig = {
    ...defaultConfig,
    ...userConfig,
    logLevels: mergeLogLevels(defaultConfig.logLevels, userConfig.logLevels),
  };

  // Validate merged config
  validateConfig(finalConfig);

  const isBrowser = typeof window !== 'undefined';
  const currentHostname = isBrowser ? window.location.hostname : 'node';
  const environment = finalConfig.environments[ENV_DEVELOPMENT].includes(currentHostname)
    ? ENV_DEVELOPMENT
    : ENV_PRODUCTION;

  /**
   * Sends log data to configured webhook
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   */
  const sendLogViaWebhook = async (level, message, metadata = {}) => {
    if (!finalConfig.useWebhook || !finalConfig.webhookUrl) {
      return;
    }

    try {
      const payload = {
        level,
        message,
        metadata,
        componentName,
        timestamp: new Date().toISOString(),
        environment,
      };

      await axios.post(finalConfig.webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000, // 5 second timeout
      });
    } catch (error) {
      // Avoid infinite loop by using plain console.error
      if (typeof console !== 'undefined' && console.error) {
        console.error('[Beaver] Error sending log via webhook:', error.message);
      }
    }
  };

  /**
   * Generates formatted timestamp
   * @returns {string} Formatted timestamp
   */
  const timestamp = () => {
    const now = new Date();
    return `${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;
  };

  /**
   * Formats metadata object for display
   * @param {Object} metadata - Metadata object
   * @returns {string} Formatted metadata string
   */
  const formatMetadata = (metadata) => {
    if (!metadata || typeof metadata !== 'object' || Object.keys(metadata).length === 0) {
      return '';
    }

    try {
      return ` | Metadata: ${JSON.stringify(metadata)}`;
    } catch {
      return ` | Metadata: [Circular or Invalid]`;
    }
  };

  /**
   * Gets source line information from stack trace
   * @returns {string} Line information
   */
  const getLineInfo = () => {
    try {
      const stack = new Error().stack;
      if (!stack) return '';

      const lines = stack.split('\n');
      // Skip first 3 lines: Error, getLineInfo, safeLog
      const callerLine = lines[4] || lines[3] || '';
      return callerLine.trim();
    } catch {
      return '';
    }
  };

  /**
   * Creates a safe logging function for a specific level
   * @param {string} level - Log level name
   * @returns {Function} Logging function
   */
  const safeLog = (level) => {
    return (...args) => {
      // Check log filter
      if (finalConfig.logFilter && finalConfig.logFilter !== level) {
        return;
      }

      const levelConfig = finalConfig.logLevels[level];
      if (!levelConfig) {
        console.warn(`[Beaver] Unknown log level: ${level}`);
        return;
      }

      // Check if should log in current environment
      if (environment === ENV_PRODUCTION && !levelConfig.production && !finalConfig.forceLog) {
        return;
      }

      const [content, metadata = {}] = args;
      const formattedMetadata = formatMetadata(metadata);
      const lineInfo = finalConfig.includeLineInfo ? ` | ${getLineInfo()}` : '';
      const logMessage = `[${level.toUpperCase()} | ${timestamp()}${lineInfo}] ${componentName} | ${content}${formattedMetadata}`;

      // Determine which console method to use
      const consoleMethod = STANDARD_CONSOLE_METHODS.includes(level) ? level : 'log';
      const consoleStyle = `color: ${levelConfig.color}; background: ${levelConfig.background};`;

      const executeLog = () => {
        if (typeof console !== 'undefined' && console[consoleMethod]) {
          // Use styled console in browser, plain text in Node
          if (isBrowser) {
            console[consoleMethod](`%c${logMessage}`, consoleStyle);
          } else {
            console[consoleMethod](logMessage);
          }
        }
      };

      // Execute log synchronously or asynchronously
      if (finalConfig.asyncLogging) {
        setImmediate ? setImmediate(executeLog) : setTimeout(executeLog, 0);
      } else {
        executeLog();
      }

      // Send to webhook if configured (always async, non-blocking)
      if (finalConfig.useWebhook) {
        sendLogViaWebhook(level, logMessage, metadata).catch(() => {
          // Silently fail - already logged in sendLogViaWebhook
        });
      }
    };
  };

  // Create logger object with methods for each log level
  const logger = {};
  Object.keys(finalConfig.logLevels).forEach((level) => {
    logger[level] = safeLog(level);
  });

  /**
   * Creates a collapsible log group
   * @param {...any} args - Group title and additional arguments
   */
  logger.group = (...args) => {
    if (environment !== ENV_PRODUCTION || finalConfig.forceLog) {
      const [title] = args;
      if (typeof console !== 'undefined' && console.groupCollapsed) {
        console.groupCollapsed(`[${componentName}] ${title}`);
      }
    }
  };

  /**
   * Ends the current log group
   */
  logger.groupEnd = () => {
    if (environment !== ENV_PRODUCTION || finalConfig.forceLog) {
      if (typeof console !== 'undefined' && console.groupEnd) {
        console.groupEnd();
      }
    }
  };

  /**
   * Gets current environment
   * @returns {string} Current environment
   */
  logger.getEnvironment = () => environment;

  /**
   * Gets current configuration
   * @returns {Object} Current configuration (read-only copy)
   */
  logger.getConfig = () => ({ ...finalConfig });

  return logger;
}

module.exports = Beaver;
