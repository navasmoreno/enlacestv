/**
 * Sistema centralizado de manejo de errores
 */

export class AppError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource, id) {
    super(
      'NOT_FOUND',
      `${resource} with id "${id}" not found`,
      404,
      { resource, id }
    );
    this.name = 'NotFoundError';
  }
}

export class FirebaseError extends AppError {
  constructor(originalError) {
    super('FIREBASE_ERROR', originalError.message || 'Firebase operation failed', 500, {
      code: originalError.code,
      originalError: originalError.message,
    });
    this.name = 'FirebaseError';
  }
}

/**
 * Logger centralizado
 */
export class Logger {
  static info(message, data = null) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  }

  static warn(message, data = null) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  }

  static error(message, error = null) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
    }
  }
}

/**
 * Manejador global de errores con notificaciones
 */
export class ErrorHandler {
  constructor(notificationService = null) {
    this.notificationService = notificationService;
  }

  handle(error, context = '') {
    const appError = this.normalizeError(error);
    
    Logger.error(`Error in ${context}`, appError.toJSON());
    
    if (this.notificationService) {
      this.notificationService.error(appError.message);
    }
    
    return appError;
  }

  normalizeError(error) {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof FirebaseError) {
      return error;
    }

    if (error?.code?.startsWith('auth/')) {
      return new FirebaseError(error);
    }

    if (error instanceof TypeError) {
      return new AppError('TYPE_ERROR', error.message, 500, { originalError: error });
    }

    if (error instanceof Error) {
      return new AppError('UNKNOWN_ERROR', error.message, 500, { originalError: error });
    }

    return new AppError('UNKNOWN_ERROR', String(error), 500);
  }

  async tryAsync(asyncFn, context = 'Async Operation') {
    try {
      return await asyncFn();
    } catch (error) {
      this.handle(error, context);
      throw this.normalizeError(error);
    }
  }
}

export const errorHandler = new ErrorHandler();
