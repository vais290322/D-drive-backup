import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from '../config/logger.js';

/**
 * Security headers middleware (Helmet)
 */
export const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
            scriptSrc: ["'self'", 'https://checkout.razorpay.com', 'https://checkout.paypal.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", process.env.CLIENT_URL || 'http://localhost:5173'],
        },
    },
    crossOriginEmbedderPolicy: false,
});

/**
 * Rate limiting middleware
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

export const apiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Request logging middleware (Morgan + Winston)
 */
export const requestLogger = morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
});

/**
 * Error logging middleware
 */
export const errorLogger = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next(err);
};
