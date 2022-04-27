import { SerializedLayer } from 'src/types'
import * as LAYERS from '../vanilla'

function getPropsFromLayer(layer: SerializedLayer) {
  // @ts-ignore
  const constructor = LAYERS[layer.constructor]
  const instance = new constructor()
  let props = ''
  Object.entries(layer.properties).forEach(([key, val]) => {
    const defaultVal = constructor['u_' + key] ?? instance[key]

    switch (key) {
      case 'name':
        if (val !== layer.constructor) props += ` ${key}={${JSON.stringify(val)}}`
        break

      case 'visible':
        if (!val) props += ` ${key}={${JSON.stringify(val)}}`
        break

      default:
        if (val !== defaultVal) props += ` ${key}={${JSON.stringify(val)}}`
        break
    }
  })

  return props
}

export function serializedLayersToJSX(layers: SerializedLayer[], material: SerializedLayer) {
  const materialProps = getPropsFromLayer(material)

  const jsx = `
    <LayerMaterial${materialProps}>
      ${layers
        .map((layer) => {
          const props = getPropsFromLayer(layer)
          return `<${layer.constructor}${props} />`
        })
        .join('\n\t')}
    </LayerMaterial>
    `

  return jsx
}

function getJSPropsFromLayer(layer: SerializedLayer) {
  // @ts-ignore
  const constructor = LAYERS[layer.constructor];
  const instance = new constructor();
  let props = '\t';
  let entries = Object.entries(layer.properties);
  entries.forEach(([key, val], idx) => {
    var _constructor;
    const eol = '\n\t\t';
    if (key.includes('color')) {
      const v = typeof val === "string" ? val : '#' + val.getHexString();
      props += `${key}: ${JSON.stringify(v)},${eol}`;
    } else {
      const defaultVal = (_constructor = constructor['u_' + key]) != null ? _constructor : instance[key];
      switch (key) {
        case 'name':
          if (val !== layer.constructor) props += `${key}: ${JSON.stringify(val)},${eol}`;
          break;
          
          case 'visible':
            if (!val) props += `${key}:${JSON.stringify(val)},${eol}`;
            break;
            
          default:
            if (val !== defaultVal) props += `${key}: ${JSON.stringify(val)},${eol}`;
            break;
        }
      }
  });
  return props;
}

export function serializedLayersToJS(layers: SerializedLayer[], material: SerializedLayer){
  const materialProps = getJSPropsFromLayer(material);
  const jsLayers = `${layers.map(l => {
    return `new ${l.constructor}({
      ${getJSPropsFromLayer(l)}
      })`
  }).join(',\n\t\t')}`

  const js = `
  new LayerMaterial({
    ${materialProps}
    layers: [
      ${jsLayers}
    ]
  })`

  return js;
}
