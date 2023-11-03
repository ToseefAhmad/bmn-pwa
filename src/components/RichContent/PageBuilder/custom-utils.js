import React from 'react'

/**
 * Return a node by attribute
 *
 * @param node
 * @param attribute
 * @returns {*[]}
 */
export const getNodeByAttribute = (node, attribute) => {
  return [...node.children[0].children].filter((el) => {
    return !!el.getAttribute(attribute)
  })
}

export const searchNode = (node, type) => {
  return node.querySelector(type)
}

/**
 * Get attribute by node and with fallback
 *
 * @param node
 * @param {string} type
 * @param {string} fallback
 * @returns {Number|string}
 */
export const getAttributeByNode = (node, type, fallback = '') => {
  const childNodes = node.childNodes

  return Boolean(childNodes && childNodes[0].getAttribute(type))
    ? childNodes[0].getAttribute(type)
    : fallback
}

/**
 * return  a dangerouslyInsertHtml object.
 *
 * @param string
 * @returns {{__html: *}}
 */
export const toHTML = string => ({ __html: string })
