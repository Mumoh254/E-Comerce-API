import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize, printf } = format;


const consoleLogFormat = printf(({ level, message, timestamp }) => {
  return `${level}: ${message}  : ${timestamp}`;
});

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(), 
    printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`) 
  ),
  transports: [
    new transports.Console({
      format: consoleLogFormat, 
    }),
    new transports.File({ filename: "app.log", format: json() }), 
  ],
});

export default logger;
