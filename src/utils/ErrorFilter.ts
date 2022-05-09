import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ValidationException } from '../common/exceptions/validation.exception';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    console.log(error);

    if (error instanceof ValidationException) {
      return host.switchToHttp().getResponse().status(error.getStatus()).json({
        errors: error.message,
        status: error.getStatus(),
      });
    }

    const status = this.getStatus(error);

    const message = this.getMessage(error);

    return host.switchToHttp().getResponse().status(status).json({
      error: message,
      status,
      message: error['response'].message,
    });
  }

  private getStatus(error: Error) {
    let status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (error instanceof EntityNotFoundError) {
      status = 404;
    }

    return status;
  }

  private getMessage(error: Error) {
    if (!error.message && !error.stack) {
      return error;
    }

    let message: any = error.message ? error.message : error.stack;

    if (message && message.message) {
      message = message.message;
    }

    return message;
  }
}
