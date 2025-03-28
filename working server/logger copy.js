// logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Создаем директорию для логов, если её нет
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Форматирование логов
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
  }`;
});

// Конфигурация логгера
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    logFormat
  ),
  defaultMeta: { service: 'bitrix24-mcp' },
  transports: [
    // Запись всех логов с уровнем 'info' и ниже в 'combined.log'
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Запись всех логов с уровнем 'error' и ниже в 'error.log'
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Вывод всех логов в консоль в режиме разработки
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ],
  exitOnError: false
});

// Перехватчик всех необработанных исключений
logger.exceptions.handle(
  new winston.transports.File({ 
    filename: path.join(logDir, 'exceptions.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
);

// Обертки для удобного логирования HTTP запросов
logger.logApiRequest = (req, extraInfo = {}) => {
  logger.info(`API Request: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    params: req.params,
    query: req.query,
    body: req.body,
    ...extraInfo
  });
};

logger.logApiResponse = (req, res, data, extraInfo = {}) => {
  logger.info(`API Response: ${req.method} ${req.originalUrl}`, {
    statusCode: res.statusCode,
    responseTime: Date.now() - req._startTime,
    responseData: process.env.NODE_ENV === 'development' ? data : undefined,
    ...extraInfo
  });
};

logger.logApiError = (req, error, extraInfo = {}) => {
  logger.error(`API Error: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    error: error.message,
    stack: error.stack,
    params: req.params,
    query: req.query,
    body: req.body,
    ...extraInfo
  });
};

// Экспорт логгера
module.exports = logger;
