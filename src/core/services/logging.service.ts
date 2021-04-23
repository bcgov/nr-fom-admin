import { Injectable } from '@angular/core';
import { EnumLiteralsOf } from '../../core/models/enum';

export const LOG_LEVELS = {
  warn: 'WARN',
  info: 'INFO',
  error: 'ERROR',
  debug: 'DEBUG',
} as const;

export type LogLevels = EnumLiteralsOf<typeof LOG_LEVELS>;

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() {
    console.log('initialized');
  }

  logError(err: { lvl: LogLevels; mssg: string }): void {
    console.log('placeholder logging module ', err);
  }
}
