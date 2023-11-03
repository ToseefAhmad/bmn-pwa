import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@apollo/client'
import GET_HEAD_SCRIPTS_CONFIG from '../../queries/getHeadScripts.graphql'

const HeadScripts = () => {
  const { data, loading, error } = useQuery(GET_HEAD_SCRIPTS_CONFIG)

  if (loading || error || !data) {
    return null
  }

  return <Helmet>
    {
      data.storeConfig && data.storeConfig.headscripts_pwa_general_scripts
        ? data.storeConfig.headscripts_pwa_general_scripts.map((script, key) =>
          <script type={ 'text/javascript' } key={ key }>{ script.script_content }</script>
        )
        : null
    }
  </Helmet>
}

export default HeadScripts
