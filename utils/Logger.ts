import { format, createLogger, transports } from 'winston';

const { printf, combine, timestamp, colorize } = format;
const colorizer = colorize();

colorizer.addColors({
  http: 'cyan',
  error: 'red',
});

export const Logger = createLogger({
  level: 'http',
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
  },
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ message, level, timestamp }) =>
      colorizer.colorize(level, `[${timestamp}]: ${message}`),
    ),
  ),
  transports: new transports.Console(),
});
