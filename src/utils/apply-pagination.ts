export function applyPagination<T>(data: T[], page: number, rowsPerPage: number): T[] {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
