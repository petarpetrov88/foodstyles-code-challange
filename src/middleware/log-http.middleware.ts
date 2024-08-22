import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { LOGGER } from '../modules/logger/factories/logger.factory';

@Injectable()
export class LogHttp implements NestMiddleware {
  constructor(@Inject(LOGGER) private readonly logger: Logger) {}

  use(req: Request, res: Response, next: () => void) {
    const start = performance.now();
    res.once('finish', () => {
      const { method, url } = req;
      const { statusCode } = res;

      const meta: any = {
        method,
        url,
        statusCode,
        responseTime: `${Math.round(performance.now() - start)} ms`,
      };

      this.logger.http(`${method} ${url} finished with ${statusCode}`, meta);
    });
    next();
  }
}
