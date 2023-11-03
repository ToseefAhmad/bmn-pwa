import { useState } from 'react'
import t from '@bmn/translate'

const defaultSort = {
  sortText: t({ s: 'Popularity (↓)' }),
  sortId: 'sortItem.popularity.desc',
  sortAttribute: 'populariteit',
  sortDirection: 'DESC'
}

/**
 * @param props
 * @returns {[{
 *  sortDirection: string,
 *  sortAttribute: string,
 *  sortText: string
 * }, React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>]}
 */
export const useSort = (props = {}) =>
  useState(() => Object.assign({}, defaultSort, props))
