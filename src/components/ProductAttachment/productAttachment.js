import React from 'react'
import { shape, string, arrayOf } from "prop-types";

import Table from '../Table'

import t from '@bmn/translate'

import defaultClasses from './productAttachment.less';
import { mergeClasses } from "@magento/venia-ui/lib/classify";

const productAttachment = props => {
  const { product } = props
  const classes = mergeClasses(defaultClasses, props.classes)

  let attachmentData = product.attachments,
    preparedData

  if (attachmentData && attachmentData.length) {
    preparedData = attachmentData.map((attachment) => {
      const url = <a
        className={ classes.link }
        href={ attachment.file_path }
        title={ t({ s: 'Download %1', r: [ attachment.label.toLowerCase() ] }) }
        target="_blank"
      >
        <span>{ t({ s: 'Download' }) }</span>
      </a>

      return {
        key: attachment.label,
        value: url
      }
    })
  }

  return (
    preparedData ?
      <>
        <h2 className={ classes.pdp__h2 }>
          { t({ s: 'Downloads' }) }
        </h2>
        <div className={ classes.table__attachment }>
          <Table
            data={ preparedData }
          />
        </div>
      </> : <></>
  )
}

productAttachment.propTypes = {
  classes: shape({
    link: string,
    table__attachment: string
  }),
  product: shape({
    attachments: arrayOf(
      shape({
        file_path: string,
        label: string
      })
    ).isRequired
  }).isRequired
}

export default productAttachment
