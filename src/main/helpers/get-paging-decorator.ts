import { createParamDecorator } from '@nestjs/common';

export const GetPagingData = createParamDecorator((data, req) => {
  const {
    page = 1, limit = 200, description_length = 200,
    all_words = 'on', query_string = '',
  } = req.query;

  const offset = (page - 1) * limit;
  return {
    page,
    offset,
    limit,
    description_length,
    all_words,
    query_string,
  };
})