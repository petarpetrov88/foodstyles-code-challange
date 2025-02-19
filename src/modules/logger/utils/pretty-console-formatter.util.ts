import * as winston from 'winston';
import { TransformableInfo } from 'logform';
import { Logger } from '@nestjs/common';
import { MESSAGE } from 'triple-beam';
import { clc } from '@nestjs/common/utils/cli-colors.util';

const knownMeta = ['layer', 'service', 'context', 'level', 'type'];

const formatField = (
  field: string,
  dot: 'suffix' | 'prefix' | 'none' = 'suffix',
): string => {
  if (!field) {
    return '';
  }
  switch (dot) {
    case 'suffix':
      return field.concat('.');
    case 'prefix':
      return '.'.concat(field);
    default:
      return field;
  }
};

const colorByLevel = (level: string) => {
  switch (level) {
    case 'debug':
      return clc.magentaBright;
    case 'warn':
      return clc.yellow;
    case 'error':
      return clc.red;
    case 'verbose':
      return clc.cyanBright;
    default:
      return clc.green;
  }
};

export const prettyConsoleFormatter = winston.format(
  (info: TransformableInfo): TransformableInfo => {
    const { message, layer, service, context, level, type, ...rest } = info;
    const levelColor = colorByLevel(level);
    const serviceInfo = `[${formatField(service)}${layer}]`.padEnd(
      (service?.length || 0) + 6,
      ' ',
    );
    const pid = `${process.pid} `;
    const prefix = levelColor(`${serviceInfo} ${pid} -`);
    const timestamp = Logger.getTimestamp().padEnd(24, ' ');
    const levelStr = levelColor(level.toUpperCase().padStart(5, ' '));
    const traceInfo = clc.yellow(`[${context}${formatField(type, 'prefix')}]`);
    const finalMessage = levelColor(message);
    knownMeta.forEach((meta) => delete info[meta]);
    info[MESSAGE] =
      `${prefix} ${timestamp} ${levelStr} ${traceInfo} ${finalMessage} ${
        !!Object.keys(rest).length ? `(${JSON.stringify(rest)})` : ''
      }`;
    return info;
  },
);
