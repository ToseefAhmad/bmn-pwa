import React, { Fragment } from 'react'
import PropTypes, { shape, string } from 'prop-types'
import { mergeClasses } from '@magento/venia-ui/lib/classify'
import defaultClasses from './inventory-unit.less'
import t from '@bmn/translate'

const DETAIL_VIEW = 'detail'
const LIST_VIEW = 'list'

const InventoryUnit = props => {
  const {
    isComplex,
    packagingUnit,
    packagingAmount,
    realInventoryUnit,
    unitType,
    squareMeter,
    pricePerUnit,
    isMandatoryPackaging,
    type,
    fontSize
  } = props

  const classes = mergeClasses(defaultClasses, props.classes)

  const UnitTypeText = props => {
    const prefix = props.noPrefix ? '' : 'per '
    if (unitType === '') {
      return <></>
    }
    if (isComplex) {
      return prefix + t({ s: unitType.toUpperCase() }) + ' a'
    }

    return prefix + t({s: unitType.toUpperCase()})
  }

  const FullUnitQty = () => {
    let fullText = <></>;
    if (isComplex) {
      fullText = <span className={classes.unitQty}>
        (
        {squareMeter}
        <span className={classes.upperCase}> {t({s: pricePerUnit.toUpperCase()})}</span>
        )
      </span>
    }
    if (!isComplex && packagingAmount !== '0') {
      fullText = <span className={ classes.unitQty } style={ { fontSize: fontSize } }>
      (
        {t({s: packagingUnit.toUpperCase()})} { packagingAmount }
        {realInventoryUnit !== '' ? ' ' + t({s: realInventoryUnit.toUpperCase()}) : ''}
      )
      </span>
    }

    return fullText
  }

  const DetailView = () => {
    return isMandatoryPackaging !== '0'
      ? <span className={classes.unitQty}>
        <UnitTypeText noPrefix={ true }/>
        <span> {packagingAmount}</span>
        <span>{realInventoryUnit !== '' ? ' ' + t({s: realInventoryUnit.toUpperCase()}) : ''}</span>
        <span> (= {squareMeter} {pricePerUnit})</span>
      </span>
      : <span className={ classes.unitQty }>{'per ' + t({s: unitType.toUpperCase()})}</span>
  }

  return (
    <div className={classes.qtyUnit}>
      { type === LIST_VIEW
      ? <Fragment>
          <span className={classes.unitType}>
            <UnitTypeText/>
          </span>
          <FullUnitQty/>
        </Fragment>
      : <DetailView />
      }
    </div>
  )
}

InventoryUnit.propTypes = {
  classes: shape({
    qtyUnit: string,
    unitType: string,
    unitQty: string,
  }),
  isComplex: PropTypes.bool,
  packagingUnit: PropTypes.string,
  packagingAmount: PropTypes.string,
  realInventoryUnit: PropTypes.string,
  unitType: PropTypes.string,
  squareMeter: PropTypes.string,
  pricePerUnit: PropTypes.string,
  type: PropTypes.oneOf([LIST_VIEW, DETAIL_VIEW]),
  isMandatoryPackaging: string,
  fontSize: string
}

InventoryUnit.defaultProps = {
  isComplex: false,
  unitType: 'st',
  packagingUnit: 'pt',
  packagingAmount: '160',
  realInventoryUnit: 'st',
  type: 'list'
}

export default InventoryUnit
