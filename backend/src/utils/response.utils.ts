import { HttpStatus } from '@nestjs/common';

const ResponseFormat = (
  data: any = null,
  status: number = HttpStatus.OK,
  message: string = undefined,
) => ({
  data,
  status,
  message,
});

export { ResponseFormat };
