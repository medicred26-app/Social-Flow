export class Logger {
  constructor(moduleName) {
    this.moduleName = moduleName;
  }

  info(message, meta = {}) {
    console.log(`[${this.moduleName}] ${new Date().toISOString()} [INFO]: ${message}`, Object.keys(meta).length ? meta : '');
  }

  warn(message, meta = {}) {
    console.warn(`[${this.moduleName}] ${new Date().toISOString()} [WARN]: ${message}`, Object.keys(meta).length ? meta : '');
  }

  error(message, error = null, meta = {}) {
    console.error(`[${this.moduleName}] ${new Date().toISOString()} [ERROR]: ${message}`, error ? (error.stack || error) : '', Object.keys(meta).length ? meta : '');
  }
}

export const createLogger = (moduleName) => new Logger(moduleName);
