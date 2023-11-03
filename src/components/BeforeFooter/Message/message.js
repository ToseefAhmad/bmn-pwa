import React from 'react'
import CmsBlock from '../../Cms/Block'
import { shape, string, oneOf } from "prop-types";
import { useUserContext } from '@magento/peregrine/lib/context/user'
import classNames from "./message.less";

const Message = props => {
  let content = <></>
  const { config } = props
  const [{ isSignedIn }] = useUserContext()

  if (isSignedIn) {
    const identifier = config.theme_footer_above_footer_message
    if (identifier) content = <CmsBlock blockId={ identifier }/>
  }

  return content ?
    <div className={ classNames.message }>
      { content }
    </div> : content
}

Message.propTypes = {
  config: shape({
    theme_footer_above_footer_message: string
  })
}

export default Message
