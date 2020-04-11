import winston from 'winston';

const timestampFormat = 'YYYY-MM-DD HH:mm:SS';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.splat(),
        winston.format.simple(),
    ),
    transports: [
        new winston.transports.Console(),
    ]
});

export default logger