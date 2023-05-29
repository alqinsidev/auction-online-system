import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
  handleRequest(err: any, payload: any) {
    if (err || !payload) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return payload;
  }
}
