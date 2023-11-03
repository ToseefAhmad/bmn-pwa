import { useCallback, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useUserContext } from '@magento/peregrine/lib/context/user'
import { useToasts } from "@magento/peregrine"
import t from '@bmn/translate'
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql'
import { useAppContext } from '@magento/peregrine/lib/context/app'

export const useRequisitionListMenu = props => {
  const {
    mutations: {
      createRequisitionListMutation,
      updateRequisitionListMutation,
      deleteRequisitionListMutation,
      addProductsToRequisitionListMutation
    },
    onSubmit
  } = props

  const [currentList, setCurrentList] = useState(null)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requisitionLists, setRequisitionLists] = useState([])
  const [refetchCustomer, setRefetchCustomer] = useState(true)

  const [fetchCustomerData, { data: customerData }] = useLazyQuery(GET_CUSTOMER_QUERY, {
    fetchPolicy: 'no-cache'
  })
  const [createRequisitionList, { error: createRequisitionListError }] = useMutation(createRequisitionListMutation, { fetchPolicy: 'no-cache' })
  const [updateRequisitionList, { error: updateRequisitionListError }] = useMutation(updateRequisitionListMutation, { fetchPolicy: 'no-cache' })
  const [addProductsToRequisitionList, { error: addProductsToRequisitionListError }] = useMutation(addProductsToRequisitionListMutation, { fetchPolicy: 'no-cache' })
  const [deleteRequisitionList, { error: deleteRequisitionListError }] = useMutation(deleteRequisitionListMutation, { fetchPolicy: 'no-cache' })

  const [
    ,
    {
      actions: { setPageLoading }
    }
  ] = useAppContext()
  const [{ isSignedIn }] = useUserContext()

  const errors = []
  if (createRequisitionListError) {
    errors.push(createRequisitionListError.graphQLErrors[0])
  }
  if (updateRequisitionListError) {
    errors.push(updateRequisitionListError.graphQLErrors[0])
  }
  if (deleteRequisitionListError) {
    errors.push(deleteRequisitionListError.graphQLErrors[0])
  }
  if (addProductsToRequisitionListError) {
    errors.push(addProductsToRequisitionListError.graphQLErrors[0])
  }

  const copyAndClean = requisitionList => {
    const itemsData = []
    const { items, ...requisitionListData } = requisitionList
    let newList = Object.assign({}, { ...requisitionListData })

    for (const {
      id,
      requisition_list_id,
      sku,
      qty,
      store_id,
      added_at,
    } of items) {
      itemsData.push({ id, requisition_list_id, sku, qty, store_id, added_at })
    }

    newList = { ...newList, items: itemsData }

    return newList
  }

  const [, { addToast }] = useToasts()
  const setCurrentRequisitionList = useCallback(
    requisitionList => {
      requisitionList = copyAndClean(requisitionList)
      setCurrentList(requisitionList)
    }, [])

  const handleAdditionalActions = useCallback(
    async additionalActions => {
      for (const func in additionalActions) {
        if (additionalActions.hasOwnProperty(func) && typeof additionalActions[func] === 'function') {
          await additionalActions[func]()
        }
      }
    }, [])

  const handleSubmit = useCallback(
    async (formValues, additionalActions) => {
      setPageLoading(true)
      setIsSubmitting(true)
      try {
        let { items, ...requisitionData } = formValues
        const itemsData = []
        let requisitionListId = formValues.uid

        requisitionData = requisitionData || {}
        items = items || []

        for (const {
          id,
          requisition_list_id,
          sku,
          qty,
          store_id,
          added_at,
        } of items) {
          const itemObject = { requisition_list_id, sku, qty, store_id, added_at }
          if (id) {
            itemObject.id = id
          }
          itemsData.push(itemObject)
        }
        requisitionData.items = itemsData

        const variables = {
          input: requisitionData
        }

        if (!requisitionListId) {
          const createResult = await createRequisitionList({
            variables: {
              input: {
                name: requisitionData.name,
                description: requisitionData.description
              }
            }
          })
          requisitionListId = createResult.data.createRequisitionList.requisition_list.uid
          requisitionData.uid = requisitionListId
        }

        if (requisitionListId) {
          variables.requisitionListUid = requisitionData.uid
          variables.requisitionListItems = requisitionData.items.map(item => {
            return {
              sku: item.sku,
              quantity: item.qty,
              selected_options: [''],
              entered_options: [{
                uid: requisitionListId,
                value: ''
              }]
            }
          })
        }

        const mutationResult = await addProductsToRequisitionList({ variables })

        setIsSubmitting(false)
        await handleAdditionalActions(additionalActions)

        let createdRequisitionListId = null
        if (!requisitionListId
          && mutationResult.data
          && mutationResult.data.createRequisitionList
        ) {
          createdRequisitionListId = mutationResult.data.createRequisitionList.id
        }

        if (onSubmit) {
          onSubmit(requisitionListId || createdRequisitionListId)
        }

        addToast({
          type: 'success',
          message: t({ s: 'Requisition List is saved!' }),
          dismissable: true,
          timeout: 5000
        })

        setRefetchCustomer(true)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(error)
          addToast({
            type: 'error',
            message: 'Something went wrong: ' + error,
            dismissable: true,
            timeout: 5000
          })
        }
        setIsSubmitting(false)
      }
      setPageLoading(false)
    },
    [createRequisitionList, handleAdditionalActions, onSubmit, addToast, addProductsToRequisitionList, requisitionLists]
  )

  useEffect(() => {
    if (refetchCustomer) {
      fetchCustomerData()
      setRefetchCustomer(false)
    }
    if (customerData) {
      setRequisitionLists(customerData.customer.requisition_lists.items)
    }
  }, [
    fetchCustomerData,
    customerData,
    refetchCustomer,
    requisitionLists
  ])

  return {
    copyAndClean,
    createRequisitionList,
    currentList,
    errors,
    formModalOpen,
    handleSubmit,
    isDisabled: isSubmitting,
    isSignedIn,
    requisitionLists,
    setCurrentList: setCurrentRequisitionList,
    setFormModalOpen
  }
}
