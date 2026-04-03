import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ headers: Record<string, string> }>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header is missing or malformed.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
      const payload = JSON.parse(payloadJson) as { sub?: string };

      if (!payload.sub) {
        throw new UnauthorizedException('Token payload does not contain a user ID (sub).');
      }

      return payload.sub;
    } catch {
      throw new UnauthorizedException('Failed to decode token payload.');
    }
  },
);
