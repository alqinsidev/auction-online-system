import { HttpException, HttpStatus } from '@nestjs/common';
import * as Sentry from '@sentry/node';
const HandleErrorException = (error: any) => {
  if (typeof error !== 'string') {
    Sentry.captureException(error);
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  } else {
    throw new HttpException(error, HttpStatus.BAD_REQUEST);
  }
};
export default HandleErrorException;
