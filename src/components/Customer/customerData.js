import React, { useEffect } from 'react'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery'
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql'
import { useSharedSession } from '../../talons/SharedSession/useSharedSession'

// A stand alone functional component that fetches userData. This is normally done in useNavigation() in Peregrine
const CustomerData = () => {
  const [, { getUserDetails }] = useUserContext()
  const fetchUserDetails = useAwaitQuery(GET_CUSTOMER_QUERY)
  const {
    createSharedSession,
    deleteSharedSession
  } = useSharedSession()

  useEffect(() => {
    return async () => {
      await createSharedSession()
      await deleteSharedSession()
    }
  })

  useEffect(() => {
      getUserDetails({ fetchUserDetails })
    }, [fetchUserDetails, getUserDetails]
  )

  return null
}

export default CustomerData
