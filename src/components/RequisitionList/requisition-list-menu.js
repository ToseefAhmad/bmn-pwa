import React, { useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown'
import { useRequisitionListMenu } from '../../talons/RequisitionList/useRequisitionListMenu'
import ThemeModal from '../Modal/ThemeModal'
import RequisitionList from './requisition-list'
import RequisitionListForm from './requisition-list-form'
import t from '@bmn/translate'

import ADD_PRODUCTS_TO_REQUISITION_LIST_MUTATION from '../../queries/addProductsToRequisitionList.graphql'
import CREATE_REQUISITION_LIST_MUTATION from '../../queries/createRequisitionList.graphql'
import UPDATE_REQUISITION_LIST_MUTATION from '../../queries/updateRequisitionList.graphql'
import DELETE_REQUISITION_LIST_MUTATION from '../../queries/deleteRequisitionList.graphql'

import { any, arrayOf, bool, func, number, object, oneOf, oneOfType, shape, string } from 'prop-types'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './requisition-list.less'

const RequisitionListMenu = props => {
  const {
    type,
    products,
    additionalActions,
    text,
    inlineCss,
    redirectAfterUserAction = false
  } = props

  const classes = mergeClasses(defaultClasses, props.classes)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { elementRef, expanded, setExpanded } = useDropdown()

  const history = useHistory()
  const onSubmit = useCallback(requisitionListId => {
    setFormModalOpen(false)

    if (redirectAfterUserAction && requisitionListId) {
      history.push(`/requisition_list/requisition/view/requisition_id/${ requisitionListId} `)
    }
  }, [])

  const talonProps = useRequisitionListMenu({
    mutations: {
      createRequisitionListMutation: CREATE_REQUISITION_LIST_MUTATION,
      updateRequisitionListMutation: UPDATE_REQUISITION_LIST_MUTATION,
      deleteRequisitionListMutation: DELETE_REQUISITION_LIST_MUTATION,
      addProductsToRequisitionListMutation: ADD_PRODUCTS_TO_REQUISITION_LIST_MUTATION
    },
    onSubmit
  })

  const {
    copyAndClean,
    currentList,
    errors,
    handleSubmit,
    isDisabled,
    requisitionLists,
    setCurrentList
  } = talonProps

  const handleListClick = useCallback(requisitionList => {
    setExpanded(false)
    requisitionList = requisitionList || {}
    if (!requisitionList.hasOwnProperty('items')) {
      requisitionList = { ...requisitionList, items: [] }
    }

    if (products.length) {
      products.forEach((item) => {
        let sku = item.sku
        if (item.hasOwnProperty('product')) {
          sku = item.product.sku
        }
        let itemToAdd = { sku , qty: 1 }
        const existingItem = requisitionList.items.find(existing => existing.sku === item.sku)
        if (typeof existingItem !== 'undefined') {
          const qty = existingItem.qty + 1
          itemToAdd = { ...existingItem, qty: qty }
        }

        const newItems = [
          ...requisitionList.items,
          ...[itemToAdd]
        ]

        requisitionList = {
          ...requisitionList,
          items: newItems.filter((item, index) => { return newItems.indexOf(item) === index })
        }
      })
    }
    const listToEdit = copyAndClean(requisitionList)

    setCurrentList(listToEdit)
    handleSubmit(listToEdit, additionalActions)
  }, [
    additionalActions,
    copyAndClean,
    handleSubmit,
    setCurrentList,
    setExpanded,
    products
  ])

  const handleNewClick = useCallback(() => {
    const requisitionList = {
      name: '',
      description: '',
      items: []
    }

    if (products.length) {
      products.forEach((item) => {
        let sku = item.sku
        if (item.hasOwnProperty('product')) {
          sku = item.product.sku
        }
        requisitionList.items.push({ sku, qty: 1 })
      })
    }

    setCurrentList(requisitionList)
    setFormModalOpen(true)
  }, [setCurrentList, products])

  const onClose = useCallback(() => {
    setFormModalOpen(false)
  }, [])

  const requisitionListItems = useMemo(() => {
    if (!expanded) {
      return null
    }

    const lists = requisitionLists || []

    const itemElements = Array.from(lists, requisitionList => {
      const { uid } = requisitionList
      return (
        <li
          key={ uid }
          className={ classes.pointer }
        >
          <RequisitionList
            requisitionList={ requisitionList }
            onClick={ handleListClick }
          />
        </li>
      )
    })

    return (
      <div
        className={ classes.listing + ' ' + classes[type] + ' ' + classes.requisitionListingAdditional }
        data-role='requisition-list-listing'
      >
        <ul className={ classes.requisitionListBox }>
          { itemElements }
          <li
            onClick={ handleNewClick }
            className={ classes.new }
          >
            <span className={ classes.pointer }>
              { t({ s: 'Add new requisition list' }) }
            </span>
          </li>
        </ul>
      </div>
    )
  }, [
    classes,
    expanded,
    handleListClick,
    handleNewClick,
    type,
    requisitionLists
  ])

  const formModal = useMemo(() => {
    if (!formModalOpen) {
      return null
    }

    return (
      <ThemeModal
        className={ (currentList.id && !isEditing) ? classes.hidden : '' }
        extraClass={ classes.modal }
        title={ (currentList.id) ? t({ s : 'Edit requisition list' }) : t({ s : 'Create requisition list' }) }
        content={
          <RequisitionListForm
            errors={ errors }
            initialValues={ currentList }
            isDisabled={ isDisabled }
            onSubmit={ handleSubmit }
            onCancel={ onClose }
            additionalActions={ additionalActions }
          />
        }
        callback={ onClose }
        hideFooter={ true }
      />
    )
  }, [
    additionalActions,
    classes,
    currentList,
    errors,
    formModalOpen,
    handleSubmit,
    isDisabled,
    isEditing,
    onClose,
  ])

  const handleRequisitionMenuClick = () => {
    setExpanded(!expanded)
  }

  const iconElement = () => {
    let element = <span className={ classes.heart }>
      </span>

    if (type === 'icon-left') {
      element = text
        ? <span className={ `${classes.heart} ${classes.marginRight}` }>
          </span>
        : <span className={ classes.heart }>
          </span>
    }
    if (type === 'tertiary-button') {
      element = <></>
    }

    return element
  }

  return (
    <div
      ref={ elementRef }
      className={ classes.button__wrapper }
    >
      <button
        onClick={ handleRequisitionMenuClick }
        className={ `${classes.icon__wrapper} ${text ? classes.noStyle : ''}` + ' ' + classes[type] }
        style={ inlineCss }
      >
        { iconElement() }
        { text }
      </button>
      { requisitionListItems }
      { formModal }
    </div>
  )
}

RequisitionListMenu.propTypes = {
  classes: shape({
    button__wrapper: string,
    noStyle: string,
    hidden: string,
    icon__wrapper: string,
    left: string,
    list: string,
    listing: string,
    listingAdditional: string,
    modal: string,
    pointer: string,
    right: string,
    marginRight: string,
    requisitionListingAdditional: string
  }),
  products: arrayOf(shape({
    id: any,
    sku: string,
    price_range: shape({
      maximum_price: shape({
        regular_price: shape({
          currency: string,
          value: number
        })
      })
    }),
    media_gallery_entries: arrayOf(
      shape({
        label: string,
        position: number,
        disabled: bool,
        file: string.isRequired,
      }),
    ),
    description: oneOfType([
      shape({
        html: string,
      }),
      string,
    ]),
  })),
  type: oneOf(['icon-left', 'icon-right', 'button', 'tertiary-button']),
  onListClick: func,
  onNewClick: func,
  inlineCss: object,
  redirectAfterUserAction: bool
}

RequisitionListMenu.defaultProps = {
  type: 'icon-left'
}

export default RequisitionListMenu
