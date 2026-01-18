# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-18

### Added

- Complete TypeScript definitions with comprehensive types and JSDoc comments
- Input validation for configuration and component name
- New utility methods: `getEnvironment()` and `getConfig()`
- Comprehensive test suite with Jest (100+ test cases)
- ESLint and Prettier configuration for code quality
- Better error handling for axios webhook calls
- Timeout configuration for webhook requests (5 seconds)
- Support for circular metadata objects
- Node.js environment support improvements
- Additional metadata in webhook payloads (componentName, timestamp, environment)

### Changed

- **BREAKING:** Updated axios from 0.21.1 to 1.13.2 (fixes security vulnerabilities)
- **BREAKING:** Custom log levels now use `console.log` instead of `console[level]` to avoid errors
- Improved async logging to use `setImmediate` when available
- Enhanced error handling throughout the codebase
- Better browser vs Node.js detection
- Improved log message formatting
- More robust line information extraction from stack traces
- Better handling of missing console methods

### Fixed

- Security vulnerabilities in axios dependency (CVE-2021-3749, CVE-2023-45857)
- Potential errors when custom log levels don't map to console methods
- Memory leaks in async logging implementation
- Missing error handling in webhook integration
- Improper TypeScript definitions file naming (.d.ts → index.d.ts)
- Edge cases with circular metadata objects
- Environment detection for Node.js environments

### Security

- Updated axios to address CSRF and SSRF vulnerabilities
- Added request timeout to webhook calls
- Improved error handling to prevent information leakage

## [1.0.2] - Previous Release

### Initial Features

- Environment-specific logging (development and production)
- Customizable log levels with color coding
- Remote logging via webhook
- Asynchronous logging support
- Basic TypeScript definitions
