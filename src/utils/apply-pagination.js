export function applyPagination(documents, page, rowsPerPage) {
  console.log("documents",documents)
  return documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}