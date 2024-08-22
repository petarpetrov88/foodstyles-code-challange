import * as winston from 'winston';
import { TransformableInfo } from 'logform';
import { errorFields } from '../constants/error-fields.constant';

export const errorStackFormatterInline = winston.format(
  (info: TransformableInfo): TransformableInfo => {
    if (info.level !== 'error') {
      return info;
    }
    const errorField = errorFields.find((field) => info[field]) || 'stack';
    const error = info[errorField];
    const stack = info.stack || error?.stack;
    if (error?.message) {
      delete info[errorField];

      info.message += `: ${error.message}`;
    }
    if (stack) {
      delete info.stack; // delete this field from metadata, for prettier logs
      info.message += `\n${stack}\n`;
    }
    return info;
  },
);
