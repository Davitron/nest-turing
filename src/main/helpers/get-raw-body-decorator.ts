import { createParamDecorator } from '@nestjs/common';

export const GetRawBody = createParamDecorator((_data, req) => {
  const { rawBody, headers } = req;
  return { rawBody, headers };
})