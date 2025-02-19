import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, printf } = format;

// Custom format for console logging with colors
const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${level}: ${message}  : ${timestamp}`;
});

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Human-readable timestamp
    colorize(),  // For colored console output
    printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`) // Format for console
  ),
  transports: [
    new transports.Console({
      format: consoleLogFormat, // Custom console log format
    }),
    new transports.File({ filename: "app.log", format: json() }), // For file output in JSON format
  ],
});

export default logger;
