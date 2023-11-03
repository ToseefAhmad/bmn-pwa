import { getAdvanced, getBackgroundImages } from '@magento/pagebuilder/lib/utils'
import { getAttributeByNode, getNodeByAttribute } from '../../custom-utils'

export default (node) => {
  let imageNode = {}
  let content = ''

  const target = getAttributeByNode(node, 'target', '_self')
  const link = getAttributeByNode(node, 'href', '#')

  if (node.children !== null) {
    imageNode = getNodeByAttribute(node, 'data-background-images')[ 0 ]
  }

  for (const child of node.children) {
    [...child.children].forEach((childNode) => {
      if (childNode.className === 'projects-content') {
        content = childNode.innerHTML
      }
    })
  }

  return {
    link,
    target,
    content,
    ...getBackgroundImages(imageNode),
    ...getAdvanced(node)
  }
}
