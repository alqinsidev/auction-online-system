import { HttpException, HttpStatus } from '@nestjs/common';
import * as Sentry from '@sentry/node';

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Not Found Error';
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Bad Request Error';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Forbidden Request Error';
  }
}

const HandleErrorException = (error: any) => {
  if (error instanceof NotFoundError) {
    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
  } else if (error instanceof BadRequestError) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  } else if (error instanceof ForbiddenError) {
    throw new HttpException(error.message, HttpStatus.FORBIDDEN);
  } else {
    Sentry.captureException(error);
    throw new HttpException(
      'internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // if (typeof error !== 'string') {
  //   Sentry.captureException(error);
  //   throw new HttpException(
  //     'Internal server error',
  //     HttpStatus.INTERNAL_SERVER_ERROR,
  //   );
  // } else {
  //   throw new HttpException(error, HttpStatus.BAD_REQUEST);
  // }
};
export default HandleErrorException;
