/**
 * @see: https://github.com/magento/pwa-studio/discussions/3159
 *
 * This logic will force to refetch the query again.
 * The need for this logic is needed for specific cart actions, send product to requisition list and remove from cart
 * doesn't listen to the fetchPolicy: "no-cache" stuff, so that's why we are forcing to refetch some queries.
 */

/**
 * @param manager
 * @param names
 * @returns {[]}
 */
const findQueries = (manager, names) => {
  const matching = []
  manager.queries.forEach(q => {
    if (q.observableQuery && names.includes(q.observableQuery.queryName)) {
      matching.push(q)
    }
  })

  return matching
}

/**
 * @param names
 * @param client
 * @returns {Promise<unknown[]>}
 */
export const refetchQueriesByName = (names, client) => {
  return Promise.all(
    findQueries(client.queryManager, names).map(q =>
      q.observableQuery.refetch()
    )
  )
}