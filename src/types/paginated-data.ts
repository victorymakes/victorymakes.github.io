export type PaginatedData<T> = {
  page: number;
  size: number;
  total: number;
  items: T[];
};
