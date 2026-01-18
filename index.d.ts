/**
 * TypeScript definitions for beaver-js-logger
 * @module beaver-js-logger
 */

/**
 * Configuration for a single log level
 */
export interface LogLevelConfig {
  /** Console text color (hex format) */
  color: string;
  /** Console background color (hex format) */
  background: string;
  /** Whether this level should log in production */
  production: boolean;
}

/**
 * Collection of log level configurations
 */
export interface LogLevels {
  [level: string]: LogLevelConfig;
}

/**
 * Environment configuration
 */
export interface EnvironmentConfig {
  /** Hostnames considered development environment */
  development: string[];
  /** Hostnames considered production environment */
  production: string[];
}

/**
 * Beaver logger configuration options
 */
export interface BeaverConfig {
  /** Environment hostname mappings */
  environments?: EnvironmentConfig;
  /** Custom log level configurations */
  logLevels?: LogLevels;
  /** Enable asynchronous logging for performance */
  asyncLogging?: boolean;
  /** Include source line information in logs */
  includeLineInfo?: boolean;
  /** Enable webhook logging */
  useWebhook?: boolean;
  /** Webhook URL for remote logging */
  webhookUrl?: string | null;
  /** Filter logs to specific level only */
  logFilter?: string | null;
  /** Force logging regardless of environment */
  forceLog?: boolean;
}

/**
 * Metadata object for additional log context
 */
export interface LogMetadata {
  [key: string]: any;
}

/**
 * Logger instance with dynamic log methods
 */
export interface Logger {
  /** Dynamic log level methods based on configuration */
  [level: string]: (content: string, metadata?: LogMetadata) => void;
  
  /** Log at 'important' level */
  important: (content: string, metadata?: LogMetadata) => void;
  /** Log at 'log' level */
  log: (content: string, metadata?: LogMetadata) => void;
  /** Log at 'info' level */
  info: (content: string, metadata?: LogMetadata) => void;
  /** Log at 'warn' level */
  warn: (content: string, metadata?: LogMetadata) => void;
  /** Log at 'error' level */
  error: (content: string, metadata?: LogMetadata) => void;
  
  /** Create collapsible log group */
  group: (title: string, ...args: any[]) => void;
  /** End current log group */
  groupEnd: () => void;
  /** Get current environment */
  getEnvironment: () => string;
  /** Get current configuration (read-only copy) */
  getConfig: () => Readonly<BeaverConfig>;
}

/**
 * Creates a logger instance for a specific component
 * @param componentName - Name of the component using the logger
 * @param userConfig - Optional configuration options
 * @returns Logger instance with configured log methods
 * @throws {Error} If componentName is invalid or configuration is invalid
 */
declare function Beaver(componentName: string, userConfig?: BeaverConfig): Logger;

export default Beaver;
