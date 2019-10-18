export class PagedQuery {
  limit: number;
  page: number;
  description_length: number;
  all_words: string;
  query_string = '';
  offset: number
  constructor(
    limit: number,
     page: number,
    description_length: number,
    all_words: string,
    query_string: string
  ) {
    this.limit = limit;
    this.page = page;
    this.description_length = description_length;
    this.all_words = all_words;
    this.query_string = query_string;
    this.offset = (this.page - 1) * this.limit
  }
}

export class PagingResult {
  count: number;
  rows: Array<any>;
  pagingRequest: PagedQuery;
  constructor(data: object, pagingRequest: PagedQuery) {
    const { count, rows }: any = data;
    this.count = count;
    this.rows = rows;
    this.pagingRequest = pagingRequest;
  }
  
  getPagingMeta() {
    const { limit, offset, page } = this.pagingRequest;
    const totalPages = Math.ceil(this.count / limit);

    return {
      currentPage: page,
      totalPages,
      currentPageSize: limit,
      totalRecords: this.count
    }
  }
}