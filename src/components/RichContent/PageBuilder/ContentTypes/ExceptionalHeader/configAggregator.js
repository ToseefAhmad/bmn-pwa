import { getBackgroundImages } from '@magento/pagebuilder/lib/utils'
import { getNodeByAttribute } from '../../custom-utils'

export default node => {
  let imageNode = {}
  if (node.children !== null) {
    imageNode = getNodeByAttribute(node, 'data-background-images')[ 0 ]
  }

  return {
    content: node.innerHTML,
    ...getBackgroundImages(imageNode),
  }
};
