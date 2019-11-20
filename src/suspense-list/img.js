import React from 'react'
import {createResource} from '../utils'

function preloadImage(src) {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
  })
}

const imgSrcResourceCache = {}

function Img({src, alt, ...props}) {
  let imgSrcResource = imgSrcResourceCache[src]
  if (!imgSrcResource) {
    imgSrcResource = createResource(() => preloadImage(src))
    imgSrcResourceCache[src] = imgSrcResource
  }
  return <img src={imgSrcResource.read()} alt={alt} {...props} />
}

export default Img
