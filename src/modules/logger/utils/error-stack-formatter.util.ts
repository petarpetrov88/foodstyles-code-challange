import * as winston from 'winston';
import { TransformableInfo } from 'logform';
import { errorFields } from '../constants/error-fields.constant';

export const errorStackFormatter = winston.format(
  (info: TransformableInfo): TransformableInfo => {
    if (info.level !== 'error') {
      return info;
    }

    if (info.stack) {
      return info;
    }

    const errorField = errorFields.find((field) => info[field]) || 'error';
    const error = info[errorField];
    if (!error?.stack) {
      return info;
    }
    info[errorField] = error.message;
    info.stack = error.stack;
    return info;
  },
);
