import { getAdvanced, getBackgroundImages } from '@magento/pagebuilder/lib/utils'
import { getNodeByAttribute, getAttributeByNode } from '../../custom-utils'

export default (node) => {
  let imageNode = {}
  let content = ''
  let imageContent = { desktopImage: null }

  const target = getAttributeByNode(node, 'target', '_self')
  const link = getAttributeByNode(node, 'href', '#')

  if (node.children !== null) {
    imageNode = getNodeByAttribute(node, 'data-background-images')[0]
  }

  if (imageNode) {
    imageContent = getBackgroundImages(imageNode)
  }

  for (const child of node.children) {
    [...child.children].forEach((childNode) => {
      if (childNode.className === 'category-content') {
        content = childNode.innerHTML
      }
    })
  }

  return {
    link,
    content,
    target,
    ...imageContent,
    ...getAdvanced(node)
  }
}
