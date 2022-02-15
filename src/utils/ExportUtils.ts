import { SerializedMaterial } from 'src/types'

export function downloadMaterial(material: SerializedMaterial) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(material))
  const dlAnchorElem = document.createElement('a')
  dlAnchorElem.setAttribute('href', dataStr)
  dlAnchorElem.setAttribute('download', `${material.name}.lamina`)
  dlAnchorElem.click()
}

function objToPropString(obj: { [key: string]: any }, defaults: { [key: string]: any } = {}) {
  let s = ''
  let o: any = {}

  for (const key in obj) {
    if (defaults[key] !== obj[key]) {
      o[key] = obj[key]
    }
  }

  Object.entries(o).forEach(([key, value]) => {
    s += ` ${key}={${JSON.stringify(value)}}`
  })

  return s
}

export function copyMaterial(material: SerializedMaterial) {
  const jsx = /* tsx */ `

<DebugLayerMaterial${objToPropString(material.settings, material.defaults)}>
    ${material.layers
      .map(
        (layer) => `
    <${layer.type}${objToPropString(layer.settings, layer.defaults)} />
    `
      )
      .join('')}
</DebugLayerMaterial>

    `
  navigator.clipboard.writeText(jsx)
}
