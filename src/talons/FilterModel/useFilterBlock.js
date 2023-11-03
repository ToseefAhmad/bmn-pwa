import { useCallback, useEffect, useMemo, useState } from 'react'

export const useFilterBlock = props => {
  const {
    filterState,
    items
  } = props

  const hasSelected = useMemo(() => {
    return items.some(item => {
      return filterState && filterState.has(item)
    })
  }, [ filterState, items ])

  const [ isExpanded, setExpanded ] = useState(hasSelected)

  useEffect(() => {
    setExpanded(hasSelected)
  }, [ hasSelected ])

  const handleClick = useCallback(() => {
    setExpanded(value => !value)
  }, [ setExpanded ])

  return {
    handleClick,
    hasSelected,
    isExpanded
  }
}
