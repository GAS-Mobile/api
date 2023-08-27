const paginate = (page, limit, items) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedItems = items.slice(startIndex, endIndex)
  const totalPages = Math.ceil(items.length / limit)

  return { paginatedItems, totalPages }
}

module.exports = {
  paginate
}