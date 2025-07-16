import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  #logger = new Logger(CustomExceptionFilter.name);
  private readonly teamsUrl = process.env.TEAMS_WEBHOOK_URL;
  constructor() {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { statusCode, message } = this.makeMessage(exception);

    this.#logger.error(
      JSON.stringify({
        method: request.method,
        path: request.url,
        params: request.params,
        query: request.query,
        statusCode: statusCode,
        error: message,
        body: request.body,
      }),
    );
    this.#logger.error(exception);

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    return exception;
  }

  makeMessage(exception: any) {
    const statusCode =
      exception?.statusCode ||
      exception?.status ||
      HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.message;
    return { statusCode, message };
  }
}
