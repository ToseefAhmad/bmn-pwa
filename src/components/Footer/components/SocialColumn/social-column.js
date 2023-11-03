import React from 'react'
import {shape, string} from 'prop-types'

import Title from '../../../Title'
import Hexagon from '../../../Hexagon/hexagon'

import classNames from './social-column.less'

const SocialColumn = props => {
  const {socialData} = props

  return (
    <div className={classNames.socialColumn}>
      <Title type={'h2'} title={socialData.title}/>
      <Hexagon>
        <a href={socialData.facebook} target={'_blank'}><i className={classNames.facebook}/></a>
      </Hexagon>
      <Hexagon>
        <a href={socialData.youtube} target={'_blank'}><i className={classNames.youtube}/></a>
      </Hexagon>
      <Hexagon>
        <a href={socialData.linkedin} target={'_blank'}><i className={classNames.linkedin}/></a>
      </Hexagon>
    </div>
  )
}

SocialColumn.propTypes = {
  socialData: shape({
    title: string,
    facebook: string,
    linkedin: string,
    youtube: string,
  })
}

export default SocialColumn
